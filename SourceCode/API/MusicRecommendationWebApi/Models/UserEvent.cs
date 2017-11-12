
using System;
using System.Collections.Generic;

namespace MusicRecommendationWebApi.Models
{
    public class UserEvent
    {
        public string userId { get; set; }
        public DateTime timestamp {get; set;}
        public string actionType {get; set;}
        public string payload{get;set;}
        public string songId {get;set;}
    }
}