
using System;

namespace UserGeneratorBaseOnDatabase.Models
{
    public class UserEvent
    {
        public string UserId { get; set; }
        public DateTime Timestamp { get; set; }
        public string SongId { get; set; }
        public string ActionType { get; set; }
        public string PayLoad { get; set; }
        public UserEvent() {
            this.Timestamp = DateTime.Now;
        }
        public UserEvent(string _userId, string _songId,
        string _payload, string _actionType)
        {
            this.UserId = _userId;
            this.SongId = _songId;
            this.PayLoad = _payload;
            this.ActionType = _actionType;
        }
    }
}