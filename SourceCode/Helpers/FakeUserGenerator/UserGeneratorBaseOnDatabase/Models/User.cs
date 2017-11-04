
using System;

namespace UserGeneratorBaseOnDatabase.Models
{
    public class User
    {
        public User() {
            this.Id = Guid.NewGuid();
        }
        public User(string _username, string _password, string _avatarUrl,
        string _firstname, string _lastname, bool _gender,
        DateTime _birthdate, string _city)
        {
            this.Id = Guid.NewGuid();
            this.Username = _username;
            this.Password = _password;
            this.AvatarUrl = _avatarUrl;
            this.Firstname = _firstname;
            this.Lastname = _lastname;
            this.Gender = _gender;
            this.Birthdate = _birthdate;
            this.City = _city;
        }
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string AvatarUrl { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public bool Gender { get; set; }
        public DateTime Birthdate { get; set; }
        public string City { get; set; }
    }
}