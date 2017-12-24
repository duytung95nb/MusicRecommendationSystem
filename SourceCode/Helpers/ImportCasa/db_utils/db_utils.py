from cassandra.cluster import Cluster

import os
import pandas as pd


class DBUtils:
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.data_archive = os.getenv("DATA_ARCHIVE")
        self.metadata_csv = os.path.join(self.data_archive, "metadata.csv")
        self.metadata_data_frame = pd.read_csv(self.metadata_csv,
                                               sep=",", encoding='utf-8')

    def import_metadata(self):
        self.session.execute("CREATE TABLE IF NOT EXISTS song ("
                             "sid text PRIMARY KEY,"
                             "song text,"
                             "genre list<text>,"
                             "artist text,"
                             "composer text,"
                             "album text,"
                             "thumbnail text,"
                             "iframe text,"
                             "lyrics text,"
                             "listened bigint);")

        num_count = 0
        for index, item in self.metadata_data_frame.iterrows():
            id = '' if pd.isnull(item['id']) else item['id']
            song = '' if pd.isnull(item['song']) else item['song']
            artist = '' if pd.isnull(item['artist']) else item['artist']
            composer = '' if pd.isnull(item['composer']) else item['composer']
            album = '' if pd.isnull(item['album']) else item['album']
            thumbnail = '' if pd.isnull(item['thumbnail']) else item['thumbnail']
            iframe = '' if pd.isnull(item['iframe']) else item['iframe']
            genre = '' if pd.isnull(item['genre']) else item['genre']
            lyrics = '' if pd.isnull(item['lyrics']) else item['lyrics']

            if genre is not '':
                genre = genre.split("|")[1:]
            else:
                genre = list('')

            self.session.execute("INSERT INTO song "
                                 "(sid, song, artist, composer, album, "
                                 "thumbnail, iframe, genre, lyrics, listened) "
                                 "VALUES (%s, %s, %s, %s, %s, "
                                 "%s, %s, %s, %s, %s);",
                                 [id, song, artist, composer, album,
                                  thumbnail, iframe, genre, lyrics, 0])
            num_count += 1
            if num_count >= 20000:
                break
