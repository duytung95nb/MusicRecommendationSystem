using Cassandra.Mapping;
using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase
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
            For<UserEvent>()
            .TableName("user_event")
            .Column(u => u.UserId, cm => cm.WithName("uid"))
            .Column(u => u.Timestamp, cm => cm.WithName("timestamp"))
            .Column(u => u.SongId, cm => cm.WithName("song_id"))
            .Column(u => u.PayLoad, cm => cm.WithName("payload"))
            .Column(u => u.ActionType, cm => cm.WithName("action_type"));
            For<Song>()
            .TableName("song")
            .Column(s => s.Id, cm => cm.WithName("sid"))
            .Column(s => s.Album, cm => cm.WithName("album"))
            .Column(s => s.Artist, cm => cm.WithName("artist"))
            .Column(s => s.Composer, cm => cm.WithName("composer"))
            .Column(s => s.Genre, cm => cm.WithName("genre"))
            .Column(s => s.Iframe, cm => cm.WithName("iframe"))
            .Column(s => s.song, cm => cm.WithName("song"))
            .Column(s => s.Lyrics, cm => cm.WithName("lyrics"))
            .Column(s => s.Thumbnail, cm => cm.WithName("thumbnail"))
            .Column(s => s.Listened, cm => cm.WithName("listened"));
        }
    }
}
