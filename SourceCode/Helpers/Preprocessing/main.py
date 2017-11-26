""" Processing data to prepare for content-based filtering """
from cassandra.cluster import Cluster


class Preprocessor(object):
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.session.execute("CREATE TABLE IF NOT EXISTS genres ("
                             "idx int PRIMARY KEY, name text);")
        self.session.execute("CREATE TABLE IF NOT EXISTS artists ("
                             "idx int PRIMARY KEY, name text);")
        self.session.execute("CREATE TABLE IF NOT EXISTS composers ("
                             "idx int PRIMARY KEY, name text);")

    @staticmethod
    def _extract_genre(songs):
        song_list = list()
        for song in songs:
            genres = song.genre
            if genres is None:
                continue
            for genre in genres:
                if genre not in song_list:
                    song_list.append(genre)

        return song_list

    @staticmethod
    def _extract_artist(songs):
        artist_list = list()
        for song in songs:
            artist = song.artist
            if artist is None:
                continue
            if artist not in artist_list:
                artist_list.append(artist)

        return artist_list

    @staticmethod
    def _extract_composer(songs):
        composer_list = list()
        for song in songs:
            composer = song.composer
            if composer is None:
                continue
            if composer not in composer_list:
                composer_list.append(composer)

        return composer_list

    def _import_to_cassandra(self, table_name, factor_list):
        idx = 0
        cql_cmd = "INSERT INTO %s (idx, name) VALUES (%s, %s);" % \
                  (table_name, "%s", "%s")
        for factor in factor_list:
            self.session.execute(cql_cmd, [idx, factor])
            idx += 1

    def filter(self, feature):
        songs = self.session.execute("SELECT %s FROM song;" % feature)

        if feature == "genre":
            factor_list = self._extract_genre(songs)
            self._import_to_cassandra("genres", factor_list)
        elif feature == "artist":
            factor_list = self._extract_artist(songs)
            self._import_to_cassandra("artists", factor_list)
        elif feature == "composer":
            factor_list = self._extract_composer(songs)
            self._import_to_cassandra("composers", factor_list)


if __name__ == '__main__':
    preprocessor = Preprocessor()
    preprocessor.filter("genre")
    preprocessor.filter("artist")
    preprocessor.filter("composer")
