using Cassandra;
using Cassandra.Mapping;

namespace UserGeneratorBaseOnDatabase.DAL
{
    public class CassandraConnector
    {
        private Cassandra.ICluster _cluster;
        private ISession _session;
        private IMapper _mapper;
        private CassandraConnector()
        {
            this._cluster = Cluster.Builder()
            .AddContactPoint("127.0.0.1")
            .WithPort(9042)
            .Build();
            this._session = this._cluster.Connect("music_recommendation");
            this._mapper = new Mapper(this._session);
        } 
        private static CassandraConnector instance;
        public static CassandraConnector getInstance()
        {
            if (instance == null)
            {
                instance = new CassandraConnector();
            }
            return instance;
        }
        public IMapper getMapper()
        {
            return this._mapper;
        }
    }
}