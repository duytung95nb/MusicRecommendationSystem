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
            List<Song> cfRecommendedSongs = new List<Song>();
            List<Song> listenedSongs = new List<Song>();
            Console.Write(userId);
            if (userId != null) {
                var userCfResult = this.cassandraConnector.getMapper()
                .Single<UserCfResult>("WHERE uid = ?", userId);

                foreach (string songId in userCfResult.recommendedSongIds)
                {
                    var returnedSong = this.cassandraConnector.getMapper()
                    .Single<Song>("WHERE sid = ?", songId);
                    cfRecommendedSongs.Add(returnedSong);
                }
                listenedSongs = this.GetListenedSongs(userId, 10);
            }

            var mostPopularSongs = this.GetTopWeeklySongs();
            dynamic returnResult = new System.Dynamic.ExpandoObject();
            returnResult.mostPopularSongs = mostPopularSongs;
            if (listenedSongs.Count() != 0 && cfRecommendedSongs.Count() != 0) {
                returnResult.listenedSongs = listenedSongs;
                returnResult.cfRecommendedSongs = cfRecommendedSongs;
            }
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

        private List<Song> GetTopWeeklySongs() {
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
    }
}
