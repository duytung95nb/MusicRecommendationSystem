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
using MusicRecommendationWebApi.JsonObjectMappers;

namespace MusicRecommendationWebApi.Controllers
{
    [EnableCors("AllowSpecificOrigin")]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private CassandraConnector cassandraConnector;
        public UsersController()
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
        [Route("login")]
        [HttpPost]
        public IActionResult Login([FromBody] Credentials user)
        {
            User userChecked = GetUserByUsername(user.Username).Result;
            if (userChecked == null || userChecked.Password != user.Password)
                return BadRequest();
            dynamic successUserValidationData = new ExpandoObject();
            successUserValidationData.token = GenerateToken(user.Username);
            successUserValidationData.userInfo = userChecked;
            return new ObjectResult(successUserValidationData);
        }

        [Route("social-login")]
        [HttpPost]
        public IActionResult socialLogin([FromBody] UserMapper user)
        {
            // JsonConvert.DeserializeObject(user);
            User userChecked = GetUserByUsername(user.Username).Result;
            if (userChecked == null) {
                User newUser = new User();
                newUser.Id = Guid.NewGuid();
                newUser.Username = user.Username;
                newUser.AvatarUrl = user.AvatarUrl;
                newUser.Firstname = user.Firstname;
                newUser.Lastname = user.Lastname;
                this.cassandraConnector.getMapper()
                                .Insert<User>(newUser);
                userChecked = this.cassandraConnector.getMapper().Single<User>("WHERE username=?", newUser.Username);
            }
            dynamic successUserValidationData = new ExpandoObject();
            successUserValidationData.token = GenerateToken(userChecked.Username);
            successUserValidationData.userInfo = userChecked;
            return new ObjectResult(successUserValidationData);
        }
        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        private string GenerateToken(string username)
        {
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(JwtRegisteredClaimNames.Nbf, new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds().ToString()),
                new Claim(JwtRegisteredClaimNames.Exp, new DateTimeOffset(DateTime.Now.AddDays(1)).ToUnixTimeSeconds().ToString()),
            };

            var token = new JwtSecurityToken(
                new JwtHeader(new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes("the secret that needs to be at least 16 characeters long for HmacSha256")),
                                             SecurityAlgorithms.HmacSha256)),
                new JwtPayload(claims));

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private async Task<User> GetUserByUsername(string username)
        {
            User userChecked = await this.cassandraConnector.getMapper()
            .FirstOrDefaultAsync<User>("SELECT * FROM user WHERE username = ?", username);
            return userChecked;
        }
    }

    public class Credentials
    {
        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
