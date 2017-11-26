from cassandra.cluster import Cluster

if __name__ == '__main__':
    cluster = Cluster()
    session = cluster.connect("music_recommendation")
    session.execute("CREATE TABLE IF NOT EXISTS ")
    uid_list = session.execute("SELECT uid FROM user;")

