from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS
from utils import handle_raw_data, get_id_based_maps, convert_to_index_based,\
    convert_to_rating_type, get_non_rated_user_music, get_final_result
from cassandra.cluster import Cluster
from pyspark_cassandra import CassandraSparkContext


class MusicCollaborativeFiltering:

    def __init__(self):
        self.sparkConfig = SparkConf()\
            .setMaster("local[4]")\
            .setAppName("MCF")\
            .set("spark.cassandra.connection.host", "127.0.0.1")\
            .set("spark.cassandra.input.consistency.level", "LOCAL_ONE")
        self.sparkContext = CassandraSparkContext(conf=self.sparkConfig)
        self.rank = 10
        self.numIteration = 10
        self.numberOfPreds = 10
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.rawData = self.session.execute("SELECT uid, song_id, payload "
                                            "FROM user_event "
                                            "WHERE action_type='rate'")
        self.session.execute("CREATE TABLE IF NOT EXISTS result_cf ("
                             "uid text PRIMARY KEY,"
                             "recommendations list<text>);")

    def run(self):
        """ This function will run the collaborative filtering algorithm and
        get the predictions for the system.
        """
        userEventData = handle_raw_data(self.rawData)
        dist_data = self.sparkContext.parallelize(userEventData)
        userMapIdBase, musicMapIdBase = get_id_based_maps(dist_data)

        user_event = convert_to_index_based(dist_data, userMapIdBase,
                                            musicMapIdBase)

        ratings = convert_to_rating_type(user_event)

        test_data = user_event.map(lambda a: (a[0], a[1]))
        model = ALS.train(ratings, self.rank, self.numIteration)
        predictions = model.predictAll(test_data).map(lambda r: ((r[0], r[1]), r[2]))
        ratesAndPreds = ratings.map(lambda r: ((r[0], r[1]), r[2])).join(predictions)
        MSE = ratesAndPreds.map(lambda r: (r[1][0] - r[1][1]) ** 2).mean()
        self.sparkContext.stop()
        return MSE


if __name__ == '__main__':
    collaborativeFiltering = MusicCollaborativeFiltering()
    MSE = collaborativeFiltering.run()
    print "Mean Squared Error: %s" % MSE
