using System;
using System.Collections.Generic;
using Cassandra;
using UserGeneratorBaseOnDatabase.DAL;
using UserGeneratorBaseOnDatabase.Models;
using UserGeneratorBaseOnDatabase.Utils;
using System.Linq;

namespace UserGeneratorBaseOnDatabase.Generators
{
    public class UserEventGenerator
    {
        const string USERNAME = "duytung95nb";
        const string PASSWORD = "duytung95nb";
        const string AVATAR_URL = "https://www.w3schools.com/css/trolltunga.jpg";
        const string FIRSTNAME = "Tung";
        const string LASTNAME = "Dao";
        const bool GENDER = false;
        const string CITY = "Sai Gon";
        private static readonly List<string> ACTION_TYPES = new List<string>(
            new string[] { "rate", "listen", "add_to_favourite", "share", "download" }
            );
        private SongDAL songDAL;
        private List<string> songIds;
        private List<Song> songs;
        private IEnumerable<User> usersList;
        private Dictionary<string, KeyValuePair<DateTime, long>> updatingListenCountSongsDictionary;
        public UserEventGenerator()
        {
            this.songDAL = new SongDAL();
            this.usersList = new UserDAL().getUsers();
            this.songIds = this.songDAL.getSongIds().ToList();
        }
        public void GenerateRandomUserEvents(int numberOfEventsPerUser)
        {
            foreach (var user in this.usersList)
            {
                this.GenerateUserEventsByUser(user, numberOfEventsPerUser);
            }
        }
        private void GenerateUserEventsByUser(User u, int numberOfEventsPerUser)
        {
            var userEventDAL = new UserEventDAL();
            for (int i = 0; i < numberOfEventsPerUser; i++)
            {
                UserEvent userEvent = new UserEvent();
                userEvent.UserId = u.Id.ToString();
                userEvent.SongId = RandomUtils.GetRandomStringInList(this.songIds);
                userEvent.ActionType = RandomUtils.GetRandomStringInList(UserEventGenerator.ACTION_TYPES);
                userEvent.PayLoad = GetUserEventPayload(userEvent.ActionType);
                userEventDAL.addUserEvent(userEvent);
                // update songs listened count to dictionary
                this.songDAL.updateSongListened(userEvent.SongId);
            }
        }

        private string GetUserEventPayload(string actionType)
        {
            string payLoad;
            switch (actionType)
            {
                case "share":
                case "add_to_favourite":
                case "download":
                    payLoad = "true";
                    break;
                case "listen":
                    int minSongLength = 0;
                    int maxSongLength = 500;
                    payLoad = RandomUtils
                    .GetRandomNumberInRange(minSongLength, maxSongLength)
                    .ToString();
                    break;
                case "rate":
                    int minRate = 1;
                    int maxRate = 5;
                    payLoad = RandomUtils
                    .GetRandomNumberInRange(minRate, maxRate)
                    .ToString();
                    break;
                default:
                    payLoad = null;
                    break;
            }
            return payLoad;
        }
    }
}
