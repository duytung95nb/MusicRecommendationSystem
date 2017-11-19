
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MusicRecommendationWebApi.Models
{
    public class UserEvent
    {
        [JsonProperty("userId")]
        public string userId { get; set; }
        [JsonProperty("timestamp")]
        public DateTime timestamp {get; set;}
        [JsonProperty("actionType")]
        public string actionType {get; set;}
        [JsonProperty("payload")]
        public string payload{get;set;}
        [JsonProperty("songId")]
        public string songId {get;set;}
    }
}