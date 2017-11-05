using Cassandra.Mapping;
using MusicRecommendationWebApi.Models;

namespace MusicRecommendationWebApi
{
    public class CassandraMapping : Mappings
    {
        public CassandraMapping()
        {
            // Define mappings in the constructor of your class
            // that inherits from Mappings
            For<User>()
               .TableName("user")
               .PartitionKey(u => u.Id)
               .Column(u => u.Id, cm => cm.WithName("uid"))
               .Column(u => u.Username, cm => cm.WithName("username"))
               .Column(u => u.Password, cm => cm.WithName("password"))
               .Column(u => u.Firstname, cm => cm.WithName("firstname"))
               .Column(u => u.Lastname, cm => cm.WithName("lastname"))
               .Column(u => u.AvatarUrl, cm => cm.WithName("avatar_url"))
               .Column(u => u.Gender, cm => cm.WithName("gender"))
               .Column(u => u.Birthdate, cm => cm.WithName("birth_date"))
               .Column(u => u.City, cm => cm.WithName("city"));
        }
    }
}