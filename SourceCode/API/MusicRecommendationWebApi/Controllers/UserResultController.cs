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
                .SingleOrDefault<UserCfResult>("WHERE uid = ?", userId);
                List<Song> cfRecommendedSongs = new List<Song>();
                HashSet<Song> listenedSongs = new HashSet<Song>();
                if (userCfResult != null) {
                    foreach (string songId in userCfResult.recommendedSongIds)
                    {
                        var returnedSong = this.cassandraConnector.getMapper()
                        .Single<Song>("WHERE sid = ?", songId);
                        cfRecommendedSongs.Add(returnedSong);
                    }
                    returnResult.cfRecommendedSongs = cfRecommendedSongs;
                }
                listenedSongs = this.GetUniqueListenedSongs(userId, 10);
                returnResult.listenedSongs = listenedSongs;
                // get recommendation base on user events
                List<UserEvent> userEventsOrdered = this.cassandraConnector.getMapper()
                    .Fetch<UserEvent>("WHERE uid = ? ORDER BY timestamp DESC", userId).ToList();
                List<UserEvent> top3LatestDistinctUserEvents = new List<UserEvent>();
                int maxNumberOfDistinctUserEvents = 3;
                foreach(var userEvent in userEventsOrdered) {
                    if(!isSongIdExistsInUserevents(userEvent.songId, top3LatestDistinctUserEvents)) {
                        top3LatestDistinctUserEvents.Add(userEvent);
                        maxNumberOfDistinctUserEvents--;
                        if (maxNumberOfDistinctUserEvents == 0)
                            break;
                    }
                }
                returnResult.userEventRecommendations = this.GetRecommendationsBaseOnUserEvents(
                    top3LatestDistinctUserEvents, 10);
                // get recommendations base on user taste
                returnResult.artistRecommendations = GetRecommendationsBaseOnTaste(userId, "artist", 10);;
                returnResult.genreRecommendations = GetRecommendationsBaseOnTaste(userId, "genre", 10);
                returnResult.composerRecommendations = GetRecommendationsBaseOnTaste(userId, "composer", 10);
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
            // user rate
            var userRateEvents = this.cassandraConnector.getMapper()
            .Fetch<UserEvent>("WHERE uid=? AND action_type='rate'", userId);
            int userRateForCurrentSong = 0;
            var userEventList = userRateEvents.ToList();
            foreach(var userRatingEvent in userEventList) 
            {
                if (userRatingEvent.songId == songId) {
                    userRateForCurrentSong = Int16.Parse(userRatingEvent.payload);
                }
            }
            // end of get user rate
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
                HashSet<Song> additionalListenedSongs = new HashSet<Song>();
                if (userId != null)
                {
                    additionalListenedSongs = this.GetUniqueListenedSongs(userId, 10 - sameAlbumSongs.Count());
                }
                nextPlaySongs.Concat(additionalListenedSongs);
            }
            dynamic returnResult = new System.Dynamic.ExpandoObject();
            returnResult.currentSong = currentSong;
            returnResult.userRateForCurrentSong = userRateForCurrentSong;
            returnResult.similarSongs = similarSongs;
            returnResult.nextPlaySongs = nextPlaySongs;
            return Ok(returnResult);
        }

        private HashSet<Song> GetUniqueListenedSongs(string userId, int limit)
        {
            IEnumerable<string> listenedSongIds = this.cassandraConnector.getMapper()
                .Fetch<string>("SELECT song_id FROM user_event WHERE uid = ? ORDER BY timestamp DESC LIMIT ?", userId, limit);
            List<Song> listenedSongs = new List<Song>();
            foreach (string songId in listenedSongIds.Distinct())
            {
                var returnedSong = this.cassandraConnector.getMapper()
                    .Single<Song>("WHERE sid = ?", songId);
                listenedSongs.Add(returnedSong);
            }
            var uniqueListenedSongs = new HashSet<Song>(listenedSongs);
            return uniqueListenedSongs;
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

        private TasteRecommend GetRecommendationsBaseOnTaste(string userId, string tasteType, int numberOfRecommendationPerEvent)
        {
            List<string> songIds = new List<string>();
            switch(tasteType) {
                case "genre":
                    try
                    {
                        var genreRecommendations = new TasteRecommend();
                        songIds = this.cassandraConnector.getMapper()
                            .SingleOrDefault<RecommendationByGenre>("WHERE uid = ?", userId)
                            .recommendations;
                        genreRecommendations.uid = userId;
                        genreRecommendations.recommendType = tasteType;
                        genreRecommendations.recommendations = this.cassandraConnector.getMapper()
                            .Fetch<Song>("WHERE sid IN ? LIMIT ?", songIds, numberOfRecommendationPerEvent)
                            .ToList();
                        return genreRecommendations;
                    }
                    catch (System.Exception)
                    {
                        return null;
                    }
                case "artist":
                    try
                    {
                        var artistRecommendations = new TasteRecommend();
                        songIds = this.cassandraConnector.getMapper()
                            .SingleOrDefault<RecommendationByArtist>("WHERE uid = ?", userId)
                            .recommendations;
                        
                        artistRecommendations.uid = userId;
                        artistRecommendations.recommendType = tasteType;
                        artistRecommendations.recommendations = this.cassandraConnector.getMapper()
                            .Fetch<Song>("WHERE sid IN ? LIMIT ?", songIds, numberOfRecommendationPerEvent)
                            .ToList();
                        return artistRecommendations;
                    }
                    catch (System.Exception)
                    {
                        return null;
                    }
                case "composer":
                    try
                    {
                        var composerRecommendations = new TasteRecommend();
                        songIds = this.cassandraConnector.getMapper()
                            .SingleOrDefault<RecommendationByComposer>("WHERE uid = ?", userId)
                            .recommendations;

                        composerRecommendations.uid = userId;
                        composerRecommendations.recommendType = tasteType;
                        composerRecommendations.recommendations = this.cassandraConnector.getMapper()
                            .Fetch<Song>("WHERE sid IN ? LIMIT ?", songIds, numberOfRecommendationPerEvent)
                            .ToList();
                        return composerRecommendations;
                    }
                    catch (System.Exception)
                    {
                        return null;
                    }
                    
                default:
                    return null;
            }
        }

        
        private bool isSongIdExistsInUserevents(string songId, List<UserEvent> userEvents) {
            foreach(var userEvent in userEvents) {
                if (songId == userEvent.songId)
                    return true;
            }
            return false;
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
        private class TasteRecommend
        {
            public string uid;
            public string recommendType;
            public List<Song> recommendations; 
            public TasteRecommend()
            {
                uid = "";
                recommendType = "";
                recommendations = new List<Song>();
            }
        }
    }
}
