
using System;
using Newtonsoft.Json;

namespace MusicRecommendationWebApi.JsonObjectMappers
{
    public class UserMapper
    {
        [JsonProperty("Id")]
        public string Id { get; set; }
        [JsonProperty("Username")]
        public string Username { get; set; }
        [JsonProperty("Password")]
        public string Password { get; set; }
        [JsonProperty("AvatarUrl")]
        public string AvatarUrl { get; set; }
        [JsonProperty("Firstname")]
        public string Firstname { get; set; }
        [JsonProperty("Lastname")]
        public string Lastname { get; set; }
        [JsonProperty("Gender")]
        public bool Gender { get; set; }
        [JsonProperty("Birthdate")]
        public DateTime Birthdate { get; set; }
        [JsonProperty("City")]
        public string City { get; set; }
    }
}