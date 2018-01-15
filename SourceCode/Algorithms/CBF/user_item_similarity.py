from cassandra.cluster import Cluster
from pyspark import SparkConf
from sklearn.metrics.pairwise import cosine_similarity
from pyspark_cassandra import CassandraSparkContext


def similar(user, items, events):
    top_sim = list()
    listened_songs = events.get(user[0])
    if listened_songs is None:
        for sid, profile in items.items():
            similarity = cosine_similarity([user[1], profile])[0][1]
            top_sim.append((sid, similarity))
    else:
        for sid, profile in items.items():
            if sid in listened_songs:
                continue

            similarity = cosine_similarity([user[1], profile])[0][1]
            top_sim.append((sid, similarity))

    top_sim.sort(key=lambda tup: tup[1], reverse=True)
    top_sim = top_sim[:10]
    top_sim = [sim[0] for sim in top_sim]

    return tuple([user[0], top_sim])


class UserItemSimilarity(object):
    def __init__(self):
        self.spark_config = SparkConf() \
            .setMaster("local[4]") \
            .setAppName("ContentBased") \
            .set("spark.cassandra.connection.host", "127.0.0.1")
        self.sparkContext = CassandraSparkContext(conf=self.spark_config)

        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")

        cql_cmd = "SELECT * FROM %s"
        cmd = cql_cmd % "i_profile_artist"
        self.i_artists_res = self.session.execute(cmd)
        cmd = cql_cmd % "i_profile_composer"
        self.i_composers_res = self.session.execute(cmd)
        cmd = cql_cmd % "i_profile_genre"
        self.i_genres_res = self.session.execute(cmd)
        cmd = cql_cmd % "u_profile_artist"
        self.u_artists_res = self.session.execute(cmd)
        cmd = cql_cmd % "u_profile_composer"
        self.u_composers_res = self.session.execute(cmd)
        cmd = cql_cmd % "u_profile_genre"
        self.u_genres_res = self.session.execute(cmd)

        cql_cmd = "SELECT uid, song_id FROM %s"
        events = self.session.execute(cql_cmd % "user_event")
        self.events = dict()
        for event in events:
            songs = self.events.get(event.uid)
            if songs is None:
                self.events[event.uid] = [event.song_id]
            else:
                self.events[event.uid].append(event.song_id)

        self.session.execute("CREATE TABLE IF NOT EXISTS "
                             "result_cb_user_item_genre ("
                             "uid text PRIMARY KEY,"
                             "recommendations list<text>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS "
                             "result_cb_user_item_artist ("
                             "uid text PRIMARY KEY,"
                             "recommendations list<text>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS "
                             "result_cb_user_item_composer ("
                             "uid text PRIMARY KEY,"
                             "recommendations list<text>);")

    @staticmethod
    def convert_i(rows):
        result = dict()
        for row in rows:
            result[row.sid] = row.profile

        return result

    @staticmethod
    def convert_u(rows):
        result = list()
        for row in rows:
            new_tuple = (row.uid, row.profile)
            result.append(new_tuple)

        return result

    def build(self):
        events = self.events

        i_genres = self.convert_i(self.i_genres_res)
        i_artists = self.convert_i(self.i_artists_res)
        i_composers = self.convert_i(self.i_composers_res)

        u_genres = self.convert_u(self.u_genres_res)
        u_artists = self.convert_u(self.u_artists_res)
        u_composers = self.convert_u(self.u_composers_res)

        dist_u_genres = self.sparkContext.parallelize(u_genres)
        dist_u_genres = dist_u_genres.map(lambda u: similar(u, i_genres, events))
        dist_u_genres.saveToCassandra("music_recommendation",
                                      "result_cb_user_item_genre")

        dist_u_artists = self.sparkContext.parallelize(u_artists)
        dist_u_artists = dist_u_artists.map(lambda u: similar(u, i_artists, events))
        dist_u_artists.saveToCassandra("music_recommendation",
                                       "result_cb_user_item_artist")

        dist_u_composer = self.sparkContext.parallelize(u_composers)
        dist_u_composer = dist_u_composer.map(lambda u: similar(u, i_composers, events))
        dist_u_composer.saveToCassandra("music_recommendation",
                                        "result_cb_user_item_composer")


if __name__ == '__main__':
    user_item_sim = UserItemSimilarity()
    user_item_sim.build()
