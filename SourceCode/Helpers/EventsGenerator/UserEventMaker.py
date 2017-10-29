# TO-DO:
# *  Read csv file
# *  Generate random user id
# *  Get random song id from csv file and set it to each user id

import csv
import random
import os
from random import randint

class UserEventMaker:
    def __init__(self):
        self.dataArchivePath = os.getenv("DATA_ARCHIVE")
        self.userDataPath = os.path.join(self.dataArchivePath, "user.csv")
        self.metadataPath = os.path.join(self.dataArchivePath, "metadata.csv")
        self.userEventPath = os.path.join(self.dataArchivePath, "user_event.csv")
        self.songIdList = UserEventMaker.get_id_list_from_csv(self.metadataPath, "id")
        self.userIdList = UserEventMaker.get_id_list_from_csv(self.userDataPath, "user_id")

    @staticmethod
    def get_id_list_from_csv(pathFile, title):
        result = []

        with open(pathFile) as metadata:
            csvReader = csv.DictReader(metadata)
            for row in csvReader:
                song_id = row[title]
                result.append(song_id)

        return result

    def validate(self, numberOfUsers, numberOfMusics):
        if numberOfMusics > len(self.songIdList):
            print "Number of musics is greater than number of musics in sys"
            return False

        if numberOfUsers > len(self.userIdList):
            print "Number of users is greater than number of users in sys"
            return False

        return True

    def gen(self, numberOfUsers, numberOfMusics):
        songIdList = UserEventMaker.get_id_list_from_csv(self.metadataPath, "id")
        userIdList = UserEventMaker.get_id_list_from_csv(self.userDataPath, "user_id")

        with open(self.userEventPath, 'wb') as csvFile:
            csvWriter = csv.writer(csvFile)
            csvWriter.writerow(["user_id", "song_id", "rating"])

            for _ in range(int(numberOfUsers)):
                userID = userIdList.pop(0)
                randomSongIndexes = random.sample(range(0, len(songIdList) - 1),
                                                  int(numberOfMusics))

                for index in randomSongIndexes:
                    randomSongID = songIdList[index]
                    randomRating = randint(1, 5)

                    data = [userID, randomSongID, randomRating]
                    csvWriter.writerow(data)


if __name__ == '__main__':
    numberOfUsers = raw_input("Number of users: ")
    numberOfMusics = raw_input("Number of musics (each user): ")
    userEventMaker = UserEventMaker()
    if userEventMaker.validate(int(numberOfUsers), int(numberOfMusics)):
        userEventMaker.gen(int(numberOfUsers), int(numberOfMusics))
        print "Succeed"
    else:
        print "Failed"
