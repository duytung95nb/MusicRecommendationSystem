from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS
from utils import handle_raw_data, get_id_based_maps, convert_to_index_based,\
    convert_to_rating_type, get_non_rated_user_music, get_final_result

import os

class MusicCollaborativeFiltering:

    def __init__(self):
        self._dataArchiveDir = os.getenv("DATA_ARCHIVE")
        self._userEventCSVFile = "%s/user_event.csv" % self._dataArchiveDir
        self._sparkConfig = SparkConf().setMaster("local[4]").setAppName("MCF")
        self._sparkContext = SparkContext(conf=self._sparkConfig)
        self._rawData = self._sparkContext.textFile(self._userEventCSVFile)
        self._rank = 10
        self._numIteration = 10
        self._numberOfPreds = 10

    def run(self):
        """ This function will run the collaborative filtering algorithm and get
            the predictions for the system.
        """
        userEventData = handle_raw_data(self._rawData)
        userMapIdBase, musicMapIdBase = get_id_based_maps(userEventData)

        userEventData = convert_to_index_based(userEventData, userMapIdBase, musicMapIdBase)
        nonRatedUserMusic = get_non_rated_user_music(userEventData)

        ratings = convert_to_rating_type(userEventData)
        model = ALS.train(ratings, self._rank, self._numIteration)

        predictions = model.predictAll(nonRatedUserMusic)
        predictions = get_final_result(self._numberOfPreds, predictions, userMapIdBase, musicMapIdBase)

        print predictions.collect()

