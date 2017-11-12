
using System;
using System.Collections.Generic;

namespace MusicRecommendationWebApi.Models
{
    public class UserCfResult
    {
        public string userId { get; set; }
        public List<string> recommendedSongIds {get; set;}
    }
}