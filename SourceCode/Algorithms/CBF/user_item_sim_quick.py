from sklearn.metrics.pairwise import cosine_similarity
from cassandra.cluster import Cluster


def similar_to(user, items):
    top_sim = list()
    for item in items:
        similarity = cosine_similarity([user.profile, item.profile])[0][1]
        top_sim.append((item.sid, similarity))

    top_sim.sort(key=lambda tup: tup[1], reverse=True)
    top_sim = top_sim[:10]
    top_sim = [sim[0] for sim in top_sim]

    return [user.uid, top_sim]


if __name__ == '__main__':
    import time
    start_time = time.time()

    uid = "a951385b-3982-4ae5-9d37-08c55325dd42"
    cluster = Cluster()
    session = cluster.connect("music_recommendation")

    i_artists_res = session.execute("SELECT * FROM i_profile_artist")
    i_composers_res = session.execute("SELECT * FROM i_profile_composer")
    i_genres_res = session.execute("SELECT * FROM i_profile_genre")

    u_artist_res = session.execute("SELECT * FROM init_profile_artist "
                                   "WHERE uid='%s'" % uid)
    u_composer_res = session.execute("SELECT * FROM init_profile_composer "
                                     "WHERE uid='%s'" % uid)
    u_genre_res = session.execute("SELECT * FROM init_profile_genre "
                                  "WHERE uid='%s'" % uid)

    import time
    start_time = time.time()

    for user in u_artist_res:
        res_artist = similar_to(user, i_artists_res)
    for user in u_composer_res:
        res_composer = similar_to(user, i_composers_res)
    for user in u_genre_res:
        res_genre = similar_to(user, i_genres_res)

    print "--- %s seconds ---" % (time.time() - start_time)
