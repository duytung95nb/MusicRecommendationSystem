using System.Collections.Generic;
using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase.DAL {
    public class UserEventDAL {
        private CassandraConnector connector;
        public UserEventDAL() {
            this.connector = CassandraConnector.getInstance();
        }
        private static IEnumerable<UserEvent> userEvents;
        public IEnumerable<UserEvent> getUserEvents()
        {
            if (UserEventDAL.userEvents == null)
            {
                UserEventDAL.userEvents = this.connector.getMapper().Fetch<UserEvent>();
            }
            return userEvents;
        }
        public void addUserEvent(UserEvent userEvent) {
            this.connector.getMapper().Insert(userEvent);
        }
    }
}