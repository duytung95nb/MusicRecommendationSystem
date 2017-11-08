from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from cassandra.cluster import Cluster

import os
import csv
import heapq
import numpy as np
import pandas as pd


class CBUtil:
    def __init__(self):
        self.data_archive = os.getenv("DATA_ARCHIVE")
        self.genre_csv_file = os.path.join(self.data_archive, "genre.csv")
        self.user_csv_file = os.path.join(self.data_archive, "user.csv")
        self.rating_csv_file = os.path.join(self.data_archive, "user_event.csv")
        self.genre_feature_file = os.path.join(self.data_archive,
                                               "genre_feature.csv")
        self.transformer = TfidfTransformer(smooth_idf=True, norm='l2')
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")

    def _get_genre_feature_col_name(self):
        genre_feature_col = ['music_id']
        genre_pd = pd.read_csv(self.genre_csv_file, sep=',', encoding='utf-8')
        for index, item in genre_pd.iterrows():
            genre_feature_col.extend([item['genre']])

        return genre_feature_col

    def _get_feature_space_matrix(self):
        feature_col_name = self._get_genre_feature_col_name()
        num_of_genres = len(feature_col_name) - 1
        feature_matrix = pd.read_csv(self.genre_feature_file, sep="|",
                                     names=feature_col_name, encoding='latin-1')
        feature_matrix = feature_matrix.as_matrix()[:, -num_of_genres:]

        return self.transformer.fit_transform(feature_matrix.tolist()).toarray()

    def _get_music_dict(self):
        feature_col_name = self._get_genre_feature_col_name()
        feature_matrix = pd.read_csv(self.genre_feature_file, sep="|",
                                     names=feature_col_name, encoding='latin-1')
        result = feature_matrix.as_matrix()[:, 0]
        result = dict(enumerate(result.flatten(), 0))
        return result

    @staticmethod
    def _get_top_similarity(sim, num_of_rec):
        result = dict(enumerate(sim.flatten(), 0))
        result = heapq.nlargest(num_of_rec, result, key=result.get)
        return result

    def _extract_factor_to_csv(self, data_rows):
        genre_list = []
        for row in data_rows:
            if row.genre is None:
                continue
            for genre in row.genre:
                if genre not in genre_list:
                    genre_list.append(genre)

        with open(self.genre_csv_file, 'wb') as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(["genre", "index"])

            for i in range(len(genre_list)):
                data = [genre_list[i].encode("utf-8"), i]
                csv_writer.writerow(data)

    def _load_csv_into_factor_dict(self):
        with open(self.genre_csv_file) as csv_file:
            csv_reader = csv.DictReader(csv_file)
            ret_map = dict()

            for row in csv_reader:
                ret_map[row["genre"]] = int(row["index"])

        return ret_map

    def _extract_song_feature_csv(self, data_rows, factor_dict):
        with open(self.genre_feature_file, 'wb') as csv_file:
            csv_writer = csv.writer(csv_file, delimiter='|')

            for row in data_rows:
                song_id = row.sid
                song_genres = row.genre

                feature_vector = ['0'] * len(factor_dict)
                if song_genres is not None:
                    for genre in song_genres:
                        feature_vector[factor_dict[genre.encode("utf-8")]] = '1'

                data = [song_id]
                data.extend(feature_vector)
                csv_writer.writerow(data)

    def prepare(self):
        rows = self.session.execute("SELECT * FROM song")
        self._extract_factor_to_csv(rows)

        rows = self.session.execute("SELECT * FROM song")
        genre_dict = self._load_csv_into_factor_dict()
        self._extract_song_feature_csv(rows, genre_dict)


    def run(self):
        music_dict = self._get_music_dict()
        feature_space_matrix = self._get_feature_space_matrix()

        self.session.execute("CREATE TABLE IF NOT EXISTS result_cb_item_item ("
                             "sid text PRIMARY KEY,"
                             "recommendations list<text>);")

        # print feature_space_matrix
        for i in range(len(feature_space_matrix)):
            item = np.reshape(feature_space_matrix[i], (1, -1))
            sim = cosine_similarity(item, feature_space_matrix)
            top_sim = self._get_top_similarity(sim[0], 10)
            top_sim = list(map(lambda x: music_dict[x], top_sim))
            print "%s ==> %s" % (music_dict[i], top_sim)
            self.session.execute("INSERT INTO result_cb_item_item "
                                 "(sid, recommendations) "
                                 "VALUES (%s, %s);", [music_dict[i], top_sim])
