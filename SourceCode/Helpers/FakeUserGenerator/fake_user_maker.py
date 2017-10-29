import csv
import os
import random


class FakeUserMaker:
    def __init__(self):
        self.dataArchivePath = os.getenv("DATA_ARCHIVE")
        self.firstNamePath = os.path.join(self.dataArchivePath, "first_name.csv")
        self.lastNamePath = os.path.join(self.dataArchivePath, "last_name.csv")
        self.userFilePath = os.path.join(self.dataArchivePath, "user.csv")
        self.firstNameList = FakeUserMaker.read_csv(self.firstNamePath, "firstname")
        self.lastNameList = FakeUserMaker.read_csv(self.lastNamePath, "lastname")

    @staticmethod
    def read_csv(path, title):
        result = []

        with open(path, 'rU') as csvFile:
            csvReader = csv.DictReader(csvFile)
            for row in csvReader:
                result.append(row[title])

        return result

    def gen(self, numberOfUsers):
        with open(self.userFilePath, 'wb') as userFileCsv:
            csvWriter = csv.writer(userFileCsv)
            csvWriter.writerow(["user_id", "user_name"])

            for userIndex in range(int(numberOfUsers)):
                userID = "usr" + str(userIndex + 1).zfill(8)
                firstName = random.choice(self.firstNameList)
                lastName = random.choice(self.lastNameList)
                fullName = firstName + " " + lastName

                csvWriter.writerow([userID, fullName])


if __name__ == '__main__':
    numberOfUsers = raw_input("Number of users: ")
    fakeUserMaker = FakeUserMaker()
    fakeUserMaker.gen(numberOfUsers)
