from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity

import os
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

    def run(self):
        music_dict = self._get_music_dict()
        feature_space_matrix = self._get_feature_space_matrix()

        for i in range(len(feature_space_matrix)):
            item = np.reshape(feature_space_matrix[i], (1, -1))
            sim = cosine_similarity(item, feature_space_matrix)
            top_sim = self._get_top_similarity(sim[0], 10)
            top_sim = list(map(lambda x: music_dict[x], top_sim))
            print "%s ==> %s" % (music_dict[i], top_sim)
