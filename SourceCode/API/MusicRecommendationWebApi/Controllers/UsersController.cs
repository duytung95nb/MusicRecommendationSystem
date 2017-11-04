using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cassandra;
using Cassandra.Mapping;
using MusicRecommendationWebApi.Models;

namespace MusicRecommendationWebApi.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private ICluster _cluster;
        private ISession _session;
        private IMapper _mapper;
        public UsersController() {
            this._cluster = Cluster.Builder()
            .AddContactPoint("127.0.0.1")
            .WithPort(9042)
            .Build();
            this._session = this._cluster.Connect("musicrecommendation");
            this._mapper = new Mapper(this._session);
        }
        // GET api/values
        [HttpGet]
        public IEnumerable<User> Get()
        {
            var usersList = this._mapper.Fetch<User>();
            return usersList;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
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
    }
}
