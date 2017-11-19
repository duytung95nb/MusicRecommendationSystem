using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cassandra;
using Cassandra.Mapping;
using MusicRecommendationWebApi.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using MusicRecommendationWebApi.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace MusicRecommendationWebApi.Controllers
{
    [Route("api/[controller]")]
    public class RecommendationsController : Controller
    {
        private CassandraConnector cassandraConnector;
        public RecommendationsController()
        {
            cassandraConnector = CassandraConnector.getInstance();
        }
        [EnableCors("AllowSpecificOrigin")]
        [Route("home")]
        [HttpGet]
        public IActionResult Get(string userId)
        {
            dynamic returnResult = new System.Dynamic.ExpandoObject();
            bool isUserLoggedIn = userId != null;
            if (isUserLoggedIn)
            {
                var userCfResult = this.cassandraConnector.getMapper()
                .Single<UserCfResult>("WHERE uid = ?", userId);
                List<Song> cfRecommendedSongs = new List<Song>();
                List<Song> listenedSongs = new List<Song>();
                foreach (string songId in userCfResult.recommendedSongIds)
                {
                    var returnedSong = this.cassandraConnector.getMapper()
                    .Single<Song>("WHERE sid = ?", songId);
                    cfRecommendedSongs.Add(returnedSong);
                }
                returnResult.cfRecommendedSongs = cfRecommendedSongs;
                listenedSongs = this.GetListenedSongs(userId, 10);
                returnResult.listenedSongs = listenedSongs;
                // get recommendation base on user events
                IEnumerable<UserEvent> top3LatestUserEvents = this.cassandraConnector.getMapper()
                .Fetch<UserEvent>("WHERE uid = ? ORDER BY timestamp DESC LIMIT 3", userId);
                returnResult.userEventRecommendations = this.GetRecommendationsBaseOnUserEvents(
                    top3LatestUserEvents.ToList(), 10);
            }

            var mostPopularSongs = this.GetTopWeeklySongs();
            returnResult.mostPopularSongs = mostPopularSongs;
            return Ok(returnResult);
        }

        [EnableCors("AllowSpecificOrigin")]
        [Route("detail")]
        [HttpGet]
        public IActionResult GetSongDetail(string userId, string songId)
        {
            var currentSong = this.cassandraConnector.getMapper()
            .Single<Song>("WHERE sid = ?", songId);

            var songSbResult = this.cassandraConnector.getMapper()
            .Single<SongCbResult>("WHERE sid = ?", songId);
            List<Song> similarSongs = new List<Song>();
            foreach (string id in songSbResult.recommendations)
            {
                var returnedSong = this.cassandraConnector.getMapper()
                .Single<Song>("WHERE sid = ?", id);
                similarSongs.Add(returnedSong);
            }

            List<Song> nextPlaySongs = new List<Song>();
            var sameAlbumSongs = this.cassandraConnector.getMapper()
            .Fetch<Song>("FROM song WHERE album = ?", currentSong.Album);
            nextPlaySongs = sameAlbumSongs.ToList();
            if (sameAlbumSongs.Count() < 10)
            {
                List<Song> additionalListenedSongs = new List<Song>();
                if (userId != null)
                {
                    additionalListenedSongs = this.GetListenedSongs(userId, 10 - sameAlbumSongs.Count());
                }
                nextPlaySongs.Concat(additionalListenedSongs);
            }
            dynamic returnResult = new System.Dynamic.ExpandoObject();
            returnResult.currentSong = currentSong;
            returnResult.similarSongs = similarSongs;
            returnResult.nextPlaySongs = nextPlaySongs;
            return Ok(returnResult);
        }

        private List<Song> GetListenedSongs(string userId, int limit)
        {
            IEnumerable<string> listenedSongIds = this.cassandraConnector.getMapper()
            .Fetch<string>("SELECT song_id FROM user_event WHERE uid = ? ORDER BY timestamp DESC LIMIT ?", userId, limit);
            List<Song> listenedSongs = new List<Song>();
            foreach (string songId in listenedSongIds)
            {
                var returnedSong = this.cassandraConnector.getMapper()
                .Single<Song>("WHERE sid = ?", songId);
                listenedSongs.Add(returnedSong);
            }
            return listenedSongs;
        }

        private List<Song> GetTopWeeklySongs()
        {
            IEnumerable<string> listenedSongIds = this.cassandraConnector.getMapper()
            .Fetch<string>("SELECT sid FROM result_popularity");
            List<Song> weeklyTopSongs = new List<Song>();
            foreach (string songId in listenedSongIds)
            {
                var returnedSong = this.cassandraConnector.getMapper()
                .Single<Song>("WHERE sid = ?", songId);
                weeklyTopSongs.Add(returnedSong);
            }
            return weeklyTopSongs;
        }

        private List<SongToRecommend> GetRecommendationsBaseOnUserEvents(List<UserEvent> userEvents, int numberOfRecommendationPerEvent)
        {
            List<SongToRecommend> returnResult = new List<SongToRecommend>();
            foreach (UserEvent userEvent in userEvents)
            {
                SongCbResult sbResultSongIds = this.cassandraConnector.getMapper()
                    .Single<SongCbResult>("WHERE sid = ?", userEvent.songId);
                SongToRecommend songToRecommend = new SongToRecommend();
                songToRecommend.actionType = userEvent.actionType;
                songToRecommend.interactedSong = this.cassandraConnector.getMapper()
                    .Single<Song>("WHERE sid = ?", userEvent.songId);
                foreach (string songId in sbResultSongIds.recommendations)
                {
                    var relatedSong = this.cassandraConnector.getMapper()
                        .Single<Song>("WHERE sid = ? LIMIT ?", songId, numberOfRecommendationPerEvent);
                    songToRecommend.relatedSongs.Add(relatedSong);
                }
                returnResult.Add(songToRecommend);
            }
            return returnResult;
        }

        private class SongToRecommend
        {
            public string actionType;
            public Song interactedSong;
            public List<Song> relatedSongs;
            public SongToRecommend()
            {
                actionType = "";
                relatedSongs = new List<Song>();
            }
        }
    }
}
