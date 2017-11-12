
using System;
using System.Collections.Generic;

namespace MusicRecommendationWebApi.Models
{
    public class SongCbResult
    {
        public string Id { get; set; }
        public List<string> recommendations { get; set; }
    }
}