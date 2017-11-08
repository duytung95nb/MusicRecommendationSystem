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
        [Route("recommendations")]
        [Produces("application/json")]
        [HttpGet]
        public IActionResult GetRecommendations()
        {
            var userId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userCfResult = this.cassandraConnector.getMapper().Single<UserCfResult>
            ("WHERE uid = ?", userId);
            List<Song> cfRecommendedSongs = new List<Song>();
            foreach (string songId in userCfResult.recommendedSongIds)
            {
                var returnedSong = this.cassandraConnector.getMapper()
                .Single<Song>("WHERE sid = ?", songId);
                cfRecommendedSongs.Add(returnedSong);
            }
            dynamic returnResult = new System.Dynamic.ExpandoObject();
            returnResult.collaborative = cfRecommendedSongs;
            return Ok(Json(returnResult));
        }
    }
}
