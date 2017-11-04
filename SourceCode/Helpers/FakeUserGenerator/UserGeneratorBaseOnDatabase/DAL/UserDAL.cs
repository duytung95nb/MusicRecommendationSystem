using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase.DAL {
    public class UserDAL {
        private CassandraConnector connector;
        public UserDAL() {
            this.connector = CassandraConnector.getInstance();
        }
        public void addUser(User u) {
            this.connector.getMapper().Insert(u);
        }
    }
}