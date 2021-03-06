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
            For<Song>()
            .TableName("song")
            .Column(s => s.Id, cm => cm.WithName("sid"))
            .Column(s => s.Album, cm => cm.WithName("album"))
            .Column(s => s.Artist, cm => cm.WithName("artist"))
            .Column(s => s.Composer, cm => cm.WithName("composer"))
            .Column(s => s.Genre, cm => cm.WithName("genre"))
            .Column(s => s.Iframe, cm => cm.WithName("iframe"))
            .Column(s => s.song, cm => cm.WithName("song"))
            .Column(s => s.Thumbnail, cm => cm.WithName("thumbnail"))
            .Column(s => s.Listened, cm => cm.WithName("listened"));
            For<UserCfResult>()
            .TableName("result_cf")
            .Column(s => s.userId, cm => cm.WithName("uid"))
            .Column(s => s.recommendedSongIds, cm => cm.WithName("recommendations"));
            For<UserEvent>()
            .TableName("user_event")
            .Column(u => u.userId, cm => cm.WithName("uid"))
            .Column(u => u.timestamp, cm => cm.WithName("timestamp"))
            .Column(u => u.actionType, cm => cm.WithName("action_type"))
            .Column(u => u.payload, cm => cm.WithName("payload"))
            .Column(u => u.songId, cm => cm.WithName("song_id"));
            For<SongCbResult>()
            .TableName("result_cb_item_item")
            .Column(s => s.Id , cm => cm.WithName("sid"))
            .Column(u => u.recommendations  , cm => cm.WithName("recommendations"));
            For<Genre>()
            .TableName("genres")
            .Column(s => s.index , cm => cm.WithName("idx"))
            .Column(u => u.name  , cm => cm.WithName("name"));
            For<Composer>()
            .TableName("composers")
            .Column(s => s.index , cm => cm.WithName("idx"))
            .Column(u => u.name  , cm => cm.WithName("name"));
            For<Artist>()
            .TableName("artists")
            .Column(s => s.index , cm => cm.WithName("idx"))
            .Column(u => u.name  , cm => cm.WithName("name"));
            For<InitProfileGenre>()
            .TableName("u_profile_genre")
            .Column(u => u.uid , cm => cm.WithName("uid"))
            .Column(u => u.profile  , cm => cm.WithName("profile"));
            For<InitProfileArtist>()
            .TableName("u_profile_artist")
            .Column(u => u.uid , cm => cm.WithName("uid"))
            .Column(u => u.profile  , cm => cm.WithName("profile"));
            For<InitProfileComposer>()
            .TableName("u_profile_composer")
            .Column(u => u.uid , cm => cm.WithName("uid"))
            .Column(u => u.profile  , cm => cm.WithName("profile"));
            For<RecommendationByGenre>()
            .TableName("result_cb_user_item_genre")
            .Column(u => u.uid , cm => cm.WithName("uid"))
            .Column(u => u.recommendations  , cm => cm.WithName("recommendations"));
            For<RecommendationByArtist>()
            .TableName("result_cb_user_item_artist")
            .Column(u => u.uid , cm => cm.WithName("uid"))
            .Column(u => u.recommendations  , cm => cm.WithName("recommendations"));
            For<RecommendationByComposer>()
            .TableName("result_cb_user_item_composer")
            .Column(u => u.uid , cm => cm.WithName("uid"))
            .Column(u => u.recommendations  , cm => cm.WithName("recommendations"));
        }
    }
}