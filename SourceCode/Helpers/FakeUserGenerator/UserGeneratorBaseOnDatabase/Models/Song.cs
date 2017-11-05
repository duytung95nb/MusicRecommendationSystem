
using System;

namespace UserGeneratorBaseOnDatabase.Models
{
    public class Song
    {
        public string Id { get; set; }
        public string Album { get; set; }
        public string Artist { get; set; }
        public string Composer { get; set; }
        public string Genre { get; set; }
        public string Iframe { get; set; }
        public string song { get; set; }
        public string Thumbnail { get; set; }
        public Song() {
            this.Id = "";
        }
        public Song(string _id, string _album, string _artist, string _composer,
        string _genre, string _iframe, string _song, string _thumbnail)
        {
            this.Id = _id;
            this.Album = _album;
            this.Artist = _artist;
            this.Composer = _composer;
            this.Genre = _genre;
            this.Iframe = _iframe;
            this.song = _song;
            this.Thumbnail = _thumbnail;
        }
    }
}