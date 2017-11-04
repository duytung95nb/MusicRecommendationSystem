import csv
import os

dataArchiveDir = os.getenv("DATA_ARCHIVE")
if dataArchiveDir is None:
    print "Please source sourceme.sh before run this."
    exit(1)

metadataCsvPath = os.path.join(dataArchiveDir, "metadata.csv")
if not os.path.exists(metadataCsvPath):
    print "metadata.csv does not exist. Please crawl it."
    exit(1)


with open(metadataCsvPath) as metadata:
    csvReader = csv.DictReader(metadata)
    genreList = []
    artistList = []
    songGenreMap = {}
    songArtistMap = {}

    for row in csvReader:
        genres = row["genre"].split("|")
        artist = row["artist"]
        songId = row["id"]

        for genre in genres[1:]:
            if genre and genre not in genreList:
                genreList.append(genre)

        if artist and artist not in artistList:
            artistList.append(artist)

        songGenreMap[songId] = genres[1:]
        songArtistMap[songId] = artist

genreCsv = os.path.join(dataArchiveDir, "genre.csv")
artistCsv = os.path.join(dataArchiveDir, "artist.csv")

print "Saving genre.csv"
with open(genreCsv, 'wb') as genreCsvFile:
    csvWriter = csv.writer(genreCsvFile)
    csvWriter.writerow(["genre", "index"])

    genreIndex = 0
    for genre in genreList:
        data = [genre, genreIndex]
        csvWriter.writerow(data)
        genreIndex += 1

print "Saving artist.csv"
with open(artistCsv, 'wb') as artistCsvFile:
    csvWriter = csv.writer(artistCsvFile)
    csvWriter.writerow(["artist", "index"])

    artistIndex = 0
    for artist in artistList:
        data = [artist, artistIndex]
        csvWriter.writerow(data)
        artistIndex += 1

print "Loading genre.csv into genreMap"
with open(genreCsv) as genreCsvFile:
    csvReader = csv.DictReader(genreCsvFile)
    genreMap = {}

    for row in csvReader:
        genreMap[row["genre"]] = int(row["index"])

print "Loading artist.csv into map"
with open(artistCsv) as artistCsvFile:
    csvReader = csv.DictReader(artistCsvFile)
    artistMap = {}

    for row in csvReader:
        artistMap[row["artist"]] = int(row["index"])

genreFeatureCsv = os.path.join(dataArchiveDir, "genre_feature.csv")
artistFeatureCsv = os.path.join(dataArchiveDir, "artist_feature.csv")

print "Saving genre_feature.csv"
with open(genreFeatureCsv, 'wb') as genreFeatureCsvFile:
    csvWriter = csv.writer(genreFeatureCsvFile, delimiter='|')
    # csvWriter.writerow(["music_id", "genre"])

    for musicId, genres in songGenreMap.iteritems():
        featureVector = ['0'] * len(genreList)
        for genreName in genres:
            genreIndex = genreMap[genreName]
            featureVector[genreIndex] = '1'

        # featureVectorString = "|".join(featureVector)
        data = [musicId]
        data.extend(featureVector)
        csvWriter.writerow(data)

print "Saving artist_feature.csv"
# with open(artistFeatureCsv, 'wb') as artistFeatureCsvFile:
#     csvWriter = csv.writer(artistFeatureCsvFile)
#     csvWriter.writerow(["music_id", "artist"])
#
#     for musicId, genres in songGenreMap.iteritems():
#         featureVector = ['0'] * len(genreList)
#         for genreName in genres:
#             genreIndex = genreMap[genreName]
#             featureVector[genreIndex] = '1'
#
#         featureVectorString = "|".join(featureVector)
#         data = [musicId, featureVectorString]
#         csvWriter.writerow(data)

print "Preprocessing data is completed"
