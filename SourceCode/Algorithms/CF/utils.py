from pyspark.mllib.recommendation import Rating

def handle_raw_data(rawData):
    user_event = list()
    for row in rawData:
        new_tuple = tuple([row.uid, row.song_id, row.payload])
        user_event.append(new_tuple)

    return user_event

def get_id_based_maps(userEventData):
    """ This function will return {'music_id', 'music_index'} map and
        {'user_id', 'user_index'} map from userEventData. These maps will
        be used to convert from string id to numeric id.

    :param userEventData: set of user event data after do handle_raw_data.
    :return: userMapIdBase, musicMapIdBase.
    """
    userMapIdBase = userEventData.map(lambda line: line[0])\
                                 .distinct()\
                                 .zipWithIndex()\
                                 .collectAsMap()

    musicMapIdBase = userEventData.map(lambda row: row[1])\
                                  .distinct()\
                                  .zipWithIndex()\
                                  .collectAsMap()

    return userMapIdBase, musicMapIdBase


def convert_to_index_based(userEventData, userMapIdBase, musicMapIdBase):
    """ This function will return new RDD which each element will be formed
        into this structure: ('user_index, music_index, rating'). This stuff
        is prepared for ALS step.

    :param userEventData: set of user event data after do handle_raw_data.
    :param userMapIdBase: {user_id, user_index} map.
    :param musicMapIdBase: {music_id, music_index} map.
    :return: newRDD.
    """
    newRDD = userEventData.map(lambda line:
        convert_to_index_based_tuple(line, userMapIdBase, musicMapIdBase))

    return newRDD


def convert_to_rating_type(userEventData):
    newRDD = userEventData.map(lambda line:
        Rating(int(line[0]), int(line[1]), float(line[2])))

    return newRDD


def get_non_rated_user_music(userEventData):
    ratedUserMusic = get_rated_user_music(userEventData)
    ratedMusicSet = get_rated_music_set(ratedUserMusic)

    ratedUserMusic = ratedUserMusic.mapValues(lambda line: {line})
    ratedUserMusic = ratedUserMusic.reduceByKey(lambda a, b: a.union(b))

    nonRatedUserMusic = ratedUserMusic.map(lambda line:
                                           get_non_rated_music(line, ratedMusicSet))

    nonRatedUserMusic = nonRatedUserMusic.flatMap(lambda line:
                                                  extract_non_rated_music_set(line))

    return nonRatedUserMusic


def get_rated_music_set(ratedUserMusic):
    ratedMusicList = ratedUserMusic.map(lambda line: line[1]).distinct().collect()
    return set(ratedMusicList)


def get_rated_user_music(userEventData):
    newRDD = userEventData.map(lambda line: (int(line[0]), int(line[1])))
    return newRDD


def get_non_rated_music(line, ratedMusicSet):
    userIndex = line[0]
    ratedMusic = line[1]
    nonRatedMusic = ratedMusicSet - ratedMusic

    return tuple([userIndex, nonRatedMusic])


def extract_non_rated_music_set(line):
    userIndex = line[0]
    musicSet = line[1]
    result = []
    for music in musicSet:
        newTuple = (userIndex, music)
        result.append(newTuple)

    return result


def get_final_result(numberOfPreds, predictions, userMapIdBase, musicMapIdBase):
    userMapIndexBase = dict((v, k) for k, v in userMapIdBase.iteritems())
    musicMapIndexBase = dict((v, k) for k, v in musicMapIdBase.iteritems())

    newRDD = predictions.map(lambda rating: (rating[0], (rating[1], rating[2])))
    newRDD = newRDD.mapValues(lambda line: {line})
    newRDD = newRDD.reduceByKey(lambda a, b: a.union(b))
    newRDD = newRDD.map(lambda line: sort_prediction(line))

    newRDD = newRDD.map(lambda line:
                        finalize(line, numberOfPreds, userMapIndexBase, musicMapIndexBase))
    return newRDD


def sort_prediction(line):
    userIndex = line[0]
    musicWithRating = line[1]
    musicWithRating = sorted(musicWithRating, key=lambda tup: tup[1], reverse=True)

    return tuple([userIndex, musicWithRating])


def finalize(line, numberOfPreds, userMapIndexBase, musicMapIndexBase):
    userIndex = line[0]
    userId = userMapIndexBase[userIndex]
    musicWithRating = line[1][:numberOfPreds]
    result = []

    for stuff in musicWithRating:
        musicIndex = stuff[0]
        result.append(musicMapIndexBase[musicIndex])

    return tuple([userId, result])

def convert_to_index_based_tuple(line, userMapIdBase, musicMapIdBase):
    userIndex = userMapIdBase.get(line[0])
    musicIndex = musicMapIdBase.get(line[1])
    rating = line[2]

    return tuple([userIndex, musicIndex, rating])