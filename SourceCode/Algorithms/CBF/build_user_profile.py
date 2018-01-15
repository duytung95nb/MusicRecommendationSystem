from cassandra.cluster import Cluster


class UserProfileBuilder(object):
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.session.execute("CREATE TABLE IF NOT EXISTS u_profile_artist ("
                             "uid text PRIMARY KEY,"
                             "profile list<float>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS u_profile_composer ("
                             "uid text PRIMARY KEY,"
                             "profile list<float>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS u_profile_genre ("
                             "uid text PRIMARY KEY,"
                             "profile list<float>);")

    @staticmethod
    def compare_two_profile(init, event):
        final = [max(value) for value in zip(init, event)]
        return final

    def build(self, uid):
        """ Build profile for a specific user. """
        cql_cmd = "SELECT * FROM %s WHERE uid='%s';" % ("%s", uid)

        cmd = cql_cmd % "u_profile_artist"
        init_profile_artist = self.session.execute(cmd)[0].profile
        cmd = cql_cmd % "u_profile_composer"
        init_profile_composer = self.session.execute(cmd)[0].profile
        cmd = cql_cmd % "u_profile_genre"
        init_profile_genre = self.session.execute(cmd)[0].profile

        user_actions = self.session.execute("SELECT * "
                                            "FROM user_event "
                                            "WHERE uid='%s';" % uid)

        event_profile_artist = [0] * len(init_profile_artist)
        event_profile_composer = [0] * len(init_profile_composer)
        event_profile_genre = [0] * len(init_profile_genre)

        cql_cmd = "SELECT * FROM %s WHERE sid='%s';"
        total_user_action = 0
        for action in user_actions:
            cmd = cql_cmd % ("i_profile_artist", action.song_id)
            artist_profile = self.session.execute(cmd)[0].profile

            cmd = cql_cmd % ("i_profile_composer", action.song_id)
            composer_profile = self.session.execute(cmd)[0].profile

            cmd = cql_cmd % ("i_profile_genre", action.song_id)
            genre_profile = self.session.execute(cmd)[0].profile

            event_profile_artist = map(sum, zip(event_profile_artist,
                                                artist_profile))
            event_profile_composer = map(sum, zip(event_profile_composer,
                                                  composer_profile))
            event_profile_genre = map(sum, zip(event_profile_genre,
                                               genre_profile))
            total_user_action += 1

        if total_user_action != 0:
            event_profile_artist = map(lambda a: a / float(total_user_action),
                                       event_profile_artist)
            event_profile_composer = map(lambda a: a / float(total_user_action),
                                         event_profile_composer)
            event_profile_genre = map(lambda a: a / float(total_user_action),
                                      event_profile_genre)

        artist = self.compare_two_profile(init_profile_artist, event_profile_artist)
        composer = self.compare_two_profile(init_profile_composer, event_profile_composer)
        genre = self.compare_two_profile(init_profile_genre, event_profile_genre)

        self.session.execute("INSERT INTO u_profile_artist "
                             "(uid, profile) "
                             "VALUES (%s, %s);", [uid, artist])
        self.session.execute("INSERT INTO u_profile_composer "
                             "(uid, profile) "
                             "VALUES (%s, %s);", [uid, composer])
        self.session.execute("INSERT INTO u_profile_genre "
                             "(uid, profile) "
                             "VALUES (%s, %s);", [uid, genre])

    def build_all(self):
        user_list = self.session.execute("SELECT uid FROM user;")
        for user in user_list:
            self.build(str(user.uid))


if __name__ == '__main__':
    user_profile_builder = UserProfileBuilder()
    user_profile_builder.build_all()
