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
    [EnableCors("AllowSpecificOrigin")]
    [Route("api/[controller]")]
    public class RecommendationsController : Controller
    {
        private CassandraConnector cassandraConnector;
        public RecommendationsController()
        {
            cassandraConnector = CassandraConnector.getInstance();
        }
        // [Authorize]
        [Route("home")]
        // [Produces("application/json")]
        [HttpGet]
        public IActionResult Get(string userId)
        {
            var userCfResult = this.cassandraConnector.getMapper()
            .Single<UserCfResult>("WHERE uid = ?", userId);

            List<Song> cfRecommendedSongs = new List<Song>();
            foreach (string songId in userCfResult.recommendedSongIds)
            {
                var returnedSong = this.cassandraConnector.getMapper()
                .Single<Song>("WHERE sid = ?", songId);
                cfRecommendedSongs.Add(returnedSong);
            }

            IEnumerable<string> listenedSongIds = this.cassandraConnector.getMapper()
            .Fetch<string>("SELECT song_id FROM user_event WHERE uid = ? ORDER BY timestamp DESC LIMIT 10 ALLOW FILTERING", userId);
            List<Song> listenedSongs = new List<Song>();
            foreach(string songId in listenedSongIds) {
                var returnedSong = this.cassandraConnector.getMapper()
                .Single<Song>("WHERE sid = ?", songId);
                listenedSongs.Add(returnedSong);
            }
            dynamic returnResult = new System.Dynamic.ExpandoObject();
            returnResult.listenedSongs = listenedSongs;
            returnResult.cfRecommendedSongs = cfRecommendedSongs;
            return Ok(returnResult);
        }
    }
}
