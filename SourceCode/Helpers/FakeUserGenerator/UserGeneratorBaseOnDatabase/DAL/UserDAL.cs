using System.Collections.Generic;
using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase.DAL
{
    public class UserDAL
    {
        private CassandraConnector connector;
        public UserDAL()
        {
            this.connector = CassandraConnector.getInstance();
        }
        public IEnumerable<User> getUsers()
        {
            return this.connector.getMapper().Fetch<User>();
        }
        public void addUser(User u)
        {
            this.connector.getMapper().Insert(u);
        }
    }
}