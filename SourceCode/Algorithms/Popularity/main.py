import datetime
from pyspark import SparkConf
from cassandra.cluster import Cluster
from pyspark_cassandra import CassandraSparkContext


class Popularity(object):
    def __init__(self):
        self.spark_config = SparkConf()\
            .setMaster("local[4]")\
            .setAppName("Popularity")\
            .set("spark.cassandra.connection.host", "127.0.0.1")
        self.sparkContext = CassandraSparkContext(conf=self.spark_config)
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.raw_data = self.session.execute("SELECT song_id, timestamp "
                                             "FROM user_event "
                                             "WHERE action_type='listen';")
        self.session.execute("CREATE TABLE IF NOT EXISTS result_popularity ("
                             "sid text PRIMARY KEY,"
                             "rank int);")
        self.current_year = datetime.datetime.now().year
        self.current_month = datetime.datetime.now().month

    def _compare_date_time(self, month, year):
        if self.current_year == year:
            if self.current_month == month:
                return True

        else:
            return False

    def _handle_raw_data(self):
        new_data_set = list()
        for row in self.raw_data:
            month = row.timestamp.month
            year = row.timestamp.year
            if self._compare_date_time(month, year):
                new_tuple = tuple([row.song_id, 1])
                new_data_set.append(new_tuple)

        return new_data_set

    def calculate(self):
        dist_data = self.sparkContext.parallelize(self._handle_raw_data())
        counts = dist_data.reduceByKey(lambda a, b: a + b)
        counts.saveToCassandra("music_recommendation",
                               "result_popularity")


if __name__ == '__main__':
    popularity = Popularity()
    popularity.calculate()
