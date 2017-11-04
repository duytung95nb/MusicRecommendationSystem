
using System;

namespace MusicRecommendationWebApi.Models {
    public class User {
        public Guid Id {get; set;}
        public string Username {get; set;}
        public string Password {get; set;}
        public string AvatarUrl {get; set;}
        public string Firstname {get; set;}
        public string Lastname {get; set;}
        public bool Gender {get; set;}
        public int Age {get; set;}
        public DateTime Birthdate {get; set;}
        public string City {get; set;}
    }
}