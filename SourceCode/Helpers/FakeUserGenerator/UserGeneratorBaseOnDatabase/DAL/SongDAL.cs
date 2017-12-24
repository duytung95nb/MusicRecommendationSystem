using System.Collections.Generic;
using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase.DAL
{
    public class SongDAL
    {
        private CassandraConnector connector;
        private static IEnumerable<string> songIds;
        public SongDAL()
        {
            this.connector = CassandraConnector.getInstance();
        }
        public IEnumerable<string> getSongIds()
        {
            if (SongDAL.songIds == null)
            {
                SongDAL.songIds = this.connector.getMapper().Fetch<string>("SELECT sid FROM song");
            }
            return SongDAL.songIds;
        }
        public void updateSongListened(string songId)
        {
            Song song = this.connector.getMapper().Single<Song>("WHERE sid=?", songId); 
            this.connector.getMapper().Update<Song>("SET listened=? WHERE sid=?", ++song.Listened, song.Id);;
        }
    }
}