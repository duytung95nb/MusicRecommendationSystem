
using System;
using System.Collections.Generic;

namespace MusicRecommendationWebApi.Models
{
    public class UserCfResult
    {
        public string userId { get; set; }
        public ICollection<string> recommendedSongIds {get; set;}
    }
}