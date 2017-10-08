# TO-DO:
# *  Read csv file
# *  Generate random user id
# *  Get random song id from csv file and set it to each user id

import csv
import random
import os
from random import randint

dataArchivePath = os.getenv("DATA_ARCHIVE")
userEventPath = "%s/user_event.csv" % dataArchivePath
metadataPath = "%s/metadata.csv" % dataArchivePath

def getSongIDList(_pathCSVFile):
    songIDList = []

    with open(_pathCSVFile) as metadata:
        csvReader = csv.DictReader(metadata)
        for row in csvReader:
            song_id = row["id"]
            songIDList.append(song_id)

    return songIDList


# Main function
numberOfUsers = raw_input("Number of users: ")
numberOfMusics  = raw_input("Number of musics (each user): ")

songIDList = getSongIDList(metadataPath)

with open(userEventPath, 'wb') as csvfile:
    csvWriter = csv.writer(csvfile)
    csvWriter.writerow(["user_id", "song_id", "rating"])

    for userIndex in range(int(numberOfUsers)):
        userID = "usr" + str(userIndex + 1).zfill(8)
        randomSongIndexes = random.sample(range(0, len(songIDList) - 1), int(numberOfMusics))

        for index in randomSongIndexes:
            randomSongID = songIDList[index]
            randomRating = randint(1, 5)

            data = [userID, randomSongID, randomRating]
            csvWriter.writerow(data)

print "Saved in: %s" % userEventPath
