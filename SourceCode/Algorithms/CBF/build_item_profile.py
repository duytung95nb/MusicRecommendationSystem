from cassandra.cluster import Cluster


class ItemProfileBuilder(object):
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.session.execute("CREATE TABLE IF NOT EXISTS i_profile_artist ("
                             "sid text PRIMARY KEY, profile list<int>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS i_profile_composer ("
                             "sid text PRIMARY KEY, profile list<int>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS i_profile_genre ("
                             "sid text PRIMARY KEY, profile list<int>);")

    @staticmethod
    def _extract_artist_profile(song, artist_dict):
        artist_profile = [0] * len(artist_dict)
        if song.artist is not None:
            artist_profile[artist_dict[song.artist]] = 1

        return artist_profile

    @staticmethod
    def _extract_composer_profile(song, composer_dict):
        composer_profile = [0] * len(composer_dict)
        if song.composer is not None:
            composer_profile[composer_dict[song.composer]] = 1

        return composer_profile

    @staticmethod
    def _extract_genre_profile(song, genre_dict):
        genre_profile = [0] * len(genre_dict)
        if song.genre is not None:
            for genre in song.genre:
                genre_profile[genre_dict[genre]] = 1

        return genre_profile

    def build(self):
        artist_rows = self.session.execute("SELECT * FROM artists;")
        composer_rows = self.session.execute("SELECT * FROM composers;")
        genre_rows = self.session.execute("SELECT * FROM genres;")

        artist_dict = dict()
        composer_dict = dict()
        genre_dict = dict()

        for artist_row in artist_rows:
            artist_dict[artist_row.name] = artist_row.idx
        for composer_row in composer_rows:
            composer_dict[composer_row.name] = composer_row.idx
        for genre_row in genre_rows:
            genre_dict[genre_row.name] = genre_row.idx

        cql_cmd = "INSERT INTO {0} (sid, profile) VALUES (%s, %s);"
        songs = self.session.execute("SELECT * FROM song;")
        for song in songs:
            artist_pro5 = self._extract_artist_profile(song, artist_dict)
            composer_pro5 = self._extract_composer_profile(song, composer_dict)
            genre_pro5 = self._extract_genre_profile(song, genre_dict)

            self.session.execute(cql_cmd.format("i_profile_artist"),
                                 [song.sid, artist_pro5])
            self.session.execute(cql_cmd.format("i_profile_composer"),
                                 [song.sid, composer_pro5])
            self.session.execute(cql_cmd.format("i_profile_genre"),
                                 [song.sid, genre_pro5])


if __name__ == '__main__':
    item_profile_builder = ItemProfileBuilder()
    item_profile_builder.build()
