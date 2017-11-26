using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cassandra;
using Cassandra.Mapping;
using MusicRecommendationWebApi.Models;
using MusicRecommendationWebApi.DAL;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Dynamic;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Cors;

namespace MusicRecommendationWebApi.Controllers
{
    [EnableCors("AllowSpecificOrigin")]
    [Route("api/[controller]")]
    public class UserEventController : Controller
    {
        private CassandraConnector cassandraConnector;
        public UserEventController()
        {
            cassandraConnector = CassandraConnector.getInstance();
        }
        // GET api/values
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            var usersList = this.cassandraConnector.getMapper().Fetch<User>();
            return Ok(usersList);
        }
        [Route("log")]
        [HttpPost]
        public IActionResult LogUserEvent([FromBody] UserEvent userEvent)
        {   
            userEvent.timestamp = DateTime.Now;
            this.cassandraConnector.getMapper().Insert<UserEvent>(userEvent as UserEvent);
            return Ok(userEvent);
        }
    }
}
