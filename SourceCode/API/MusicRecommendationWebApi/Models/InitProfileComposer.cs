
using System;
using System.Collections.Generic;

namespace MusicRecommendationWebApi.Models {
    public class InitProfileComposer {
        public string uid {get; set;}
        public List<float> profile {get; set;}
    }
}