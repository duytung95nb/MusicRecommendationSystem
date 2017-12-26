from cassandra.cluster import Cluster
from sklearn.metrics.pairwise import cosine_similarity


class UserItemSimilarity(object):
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")

        cql_cmd = "SELECT * FROM %s"
        self.i_artists = self.session.execute(cql_cmd % "i_profile_artist")
        self.i_composers = self.session.execute(cql_cmd % "i_profile_composer")
        self.i_genres = self.session.execute(cql_cmd % "i_profile_genre")
        self.u_artists = self.session.execute(cql_cmd % "u_profile_artist")
        self.u_composers = self.session.execute(cql_cmd % "u_profile_composer")
        self.u_genres = self.session.execute(cql_cmd % "u_profile_genre")

        cql_cmd = "SELECT uid, song_id FROM %s"
        events = self.session.execute(cql_cmd % "user_event")
        self.events = dict()
        for event in events:
            songs = self.events.get(event.uid)
            if songs is None:
                self.events[event.uid] = [event.song_id]
            else:
                self.events[event.uid].append(event.song_id)

    def similar_to(self, user, items):
        top_sim = list()
        listened_songs = self.events.get(user.uid)
        for item in items:
            if item.sid in listened_songs:
                continue
            similarity = cosine_similarity([user.profile, item.profile])[0][1]
            if similarity == 0:
                print "user_id: %s" % user.uid
                print "user_profile: %s" % user.profile
                print "item_id: %s" % item.sid
                print "item_profile: %s" % item.profile
                print similarity
                print "============================"
            top_sim.append((user.uid, item.sid, similarity))
            top_sim.sort(key=lambda tup: tup[2])
            top_sim = top_sim[:10]

        print top_sim

    def build(self):
        for u_genre in self.u_genres:
            self.similar_to(u_genre, self.i_genres)
        for u_artist in self.u_artists:
            self.similar_to(u_artist, self.i_artists)
        for u_composer in self.u_composers:
            self.similar_to(u_composer, self.i_composers)


if __name__ == '__main__':
    user_item_sim = UserItemSimilarity()
    user_item_sim.build()
