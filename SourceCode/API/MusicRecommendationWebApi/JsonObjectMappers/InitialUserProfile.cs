
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MusicRecommendationWebApi.JsonObjectMappers {
    public class InitialUserProfile {

        [JsonProperty("id")]
        public string id {get; set;}
        [JsonProperty("genreIndexesArray")]
        public List<float> genres {get; set;}
        [JsonProperty("artistIndexesArray")]
        public List<float> artists {get; set;}
        [JsonProperty("composerIndexesArray")]
        public List<float> composers {get; set;}
    }
}