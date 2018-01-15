
using System;
using System.Collections.Generic;

namespace MusicRecommendationWebApi.Models
{
    public class RecommendationByComposer
    {
        public string uid { get; set; }
        public List<string> recommendations {get; set;}
    }
}