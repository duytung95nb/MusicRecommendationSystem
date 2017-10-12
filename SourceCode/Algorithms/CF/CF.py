# TO-DO:
# *  Read user_event.csv file and parse the data
# *  Use ALS algorithm to train data

from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS, Rating
import os


def convertPredForUserToTuple(_row, _userIndexer, _musicIndexer):
    _userID = _userIndexer[_row[0]]
    _ratings = []
    for _rating in _row[1]:
        _newTuple = (_musicIndexer[_rating.product], _rating.rating)
        _ratings.append(_newTuple)

    return tuple([_userID, _ratings])


def filterNonRatedForUser(_row, _ratedMusicOfUserMap):
    _userID = _row[0]
    _ratedMusicOfUser = _ratedMusicOfUserMap.get(_userID)
    _ratings = []
    for _rating in _row[1]:
        if _rating.product in _ratedMusicOfUser:
            continue
        _ratings.append(_rating)

    return tuple([_userID, _ratings])


def reduceNumOfMusics(_row, _numberOfMusics):
    if len(_row[1]) <= _numberOfMusics:
        return _row
    else:
        _ratings = []
        for i in range(0, _numberOfMusics):
            _ratings.append(_row[1][i])
        return tuple([_row[0], _ratings])


dataArchiveDir = os.getenv("DATA_ARCHIVE")
userEventCSVFile = dataArchiveDir + "/user_event.csv"

# Initialize spark context
conf = SparkConf().setMaster("local").setAppName("CFM")
sc = SparkContext(conf=conf)

# Load and parse data
data = sc.textFile(userEventCSVFile)
data = data.map(lambda row: row.split(","))
header = data.first()
data = data.filter(lambda row: row != header)

userIndexer = data.map(lambda row: row[0]).distinct().zipWithIndex().collectAsMap()
musicIndexer = data.map(lambda row: row[1]).distinct().zipWithIndex().collectAsMap()
musicIDs = data.map(lambda row: musicIndexer[row[1]]).distinct()

ratings = data.map(lambda row: Rating(userIndexer[row[0]], musicIndexer[row[1]], float(row[2])))

# Build the recommendation model using ALS
rank = 10
numIterations = 10
model = ALS.train(ratings, rank, numIterations)

# Evaluate the model on training data
ratedUserAndMusic = ratings.map(lambda row: (row[0], row[1]))  # Get user and music tuple
predictions = model.predictAll(ratedUserAndMusic).map(lambda row: ((row[0], row[1]), row[2]))
mseMeas = ratings.map(lambda row: ((row[0], row[1]), row[2])).join(predictions)
MSE = mseMeas.map(lambda row: (row[1][0] - row[1][1])**2).mean()
print "Mean Squared Error = %s" % str(MSE)


# Swap key value pair
userIndexer_1 = dict((value, key) for key, value in userIndexer.iteritems())
musicIndexer_1 = dict((value, key) for key, value in musicIndexer.iteritems())


# Get rated User and Music dictionary
ratedUserAndMusicDict = {}
ratedUserAndMusic_1 = ratedUserAndMusic.collect()
for item in ratedUserAndMusic_1:
    musicList = ratedUserAndMusicDict.get(item[0])
    if musicList is None:
        musicList = []
    musicList.append(item[1])
    ratedUserAndMusicDict[item[0]] = musicList


predictions_1 = model.recommendProductsForUsers(musicIDs.count())
predictions_1 = predictions_1.map(lambda row: filterNonRatedForUser(row, ratedUserAndMusicDict))
predictions_1 = predictions_1.map(lambda row: reduceNumOfMusics(row, 10))
predictions_1 = predictions_1.map(lambda row: convertPredForUserToTuple(row, userIndexer_1, musicIndexer_1))

finalResult = predictions_1.collect()

print finalResult
