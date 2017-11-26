from cassandra.cluster import Cluster
import random


class FakeUserProfileCreator:
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")
        self.user_list = self._get_user_list()
        self.genre_map = self._get_factor_map("genres")
        self.artist_map = self._get_factor_map("artists")
        self.composer_map = self._get_factor_map("composers")
        self.session.execute("CREATE TABLE IF NOT EXISTS init_profile_genre ("
                             "uid text PRIMARY KEY, "
                             "profile list<int>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS init_profile_artist ("
                             "uid text PRIMARY KEY, "
                             "profile list<int>);")
        self.session.execute("CREATE TABLE IF NOT EXISTS init_profile_composer ("
                             "uid text PRIMARY KEY, "
                             "profile list<int>);")

    def _get_factor_map(self, table_name):
        cql_cmd = "SELECT * FROM %s;" % table_name
        rows = self.session.execute(cql_cmd)
        result = {}
        for row in rows:
            result[row.idx] = row.name

        return result

    def _get_user_list(self):
        cql_cmd = "SELECT uid FROM user;"
        rows = self.session.execute(cql_cmd)
        result = []
        for row in rows:
            result.append(str(row.uid))

        return result

    def gen_fake_profile(self, factor_type, num_of_interest):
        num_of_factor = 0
        cql_cmd = "INSERT INTO %s (uid, profile) VALUES (%s, %s);"
        if factor_type == "genre":
            num_of_factor = len(self.genre_map)
            cql_cmd = cql_cmd % ("init_profile_genre", "%s", "%s")
        elif factor_type == "artist":
            num_of_factor = len(self.artist_map)
            cql_cmd = cql_cmd % ("init_profile_artist", "%s", "%s")
        elif factor_type == "composer":
            num_of_factor = len(self.composer_map)
            cql_cmd = cql_cmd % ("init_profile_composer", "%s", "%s")

        users = self._get_user_list()
        for user in users:
            init_profile = [0] * num_of_factor
            fav_index = random.sample(range(0, num_of_factor), num_of_interest)
            for index in fav_index:
                init_profile[index] = 1
            self.session.execute(cql_cmd, [user, init_profile])


if __name__ == '__main__':
    user_profile_generator = FakeUserProfileCreator()
    user_profile_generator.gen_fake_profile("genre", 5)
    user_profile_generator.gen_fake_profile("artist", 5)
    user_profile_generator.gen_fake_profile("composer", 5)
