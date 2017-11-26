from cassandra.cluster import Cluster


class UserProfileBuilder(object):
    def __init__(self):
        self.cluster = Cluster()
        self.session = self.cluster.connect("music_recommendation")

    def build(self, uid):
        rows = self.session.execute("SELECT * "
                                    "FROM user_event WHERE uid='%s'" % uid)


if __name__ == '__main__':
    user_profile_builder = UserProfileBuilder()
    user_profile_builder.build("53327fbe-003b-4d01-bdf1-b9f0fe6b6f77")
