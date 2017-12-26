import pandas as pd
from cassandra.cluster import Cluster
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel


class LyricsSimilarity:
    def __init__(self):
        self.none_lyrics = u'. Lyrics c\u1ee7a b\xe0i h\xe1t n\xe0y ' \
                           u'ch\u01b0a \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt'
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.session.execute("DROP TABLE IF EXISTS result_cb_item_item;")
        self.session.execute("CREATE TABLE IF NOT EXISTS result_cb_item_item ("
                             "sid text PRIMARY KEY,"
                             "recommendations list<text>);")

    def test(self):
        rows = self.session.execute("SELECT sid, lyrics FROM song;")
        new_tuple = ()
        for row in rows:
            sid = row.sid
            lyrics = row.lyrics
            # if unicode(self.none_lyrics) not in unicode(lyrics):
            new_tuple = new_tuple + ((sid, lyrics),)

        ds = pd.DataFrame(list(new_tuple))

        tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3),
                             min_df=0, stop_words=None)
        tfidf_matrix = tf.fit_transform(ds[1])
        cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)

        print cosine_similarities

        for idx, row in ds.iterrows():
            similar_indices = cosine_similarities[idx].argsort()[:-12:-1]
            similar_items = [ds[0][i] for i in similar_indices][1:]

            self.session.execute("INSERT INTO result_cb_item_item "
                                 "(sid, recommendations) "
                                 "VALUES (%s, %s);", [row[0], similar_items])


if __name__ == '__main__':
    lyrics_similarity = LyricsSimilarity()
    lyrics_similarity.test()
