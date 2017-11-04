using System;
using Cassandra;
using Cassandra.Mapping;

namespace UserGeneratorBaseOnDatabase
{
    class Program
    {
        static void Main(string[] args)
        {
            MappingConfiguration.Global.Define<CassandraMapping>();
            UserAutoGenerate userGenerator = new UserAutoGenerate();
            Console.Write("Input number of user to generate:");
            int userNumber = Convert.ToInt32(Console.ReadLine());
            userGenerator.GenerateRandomUserList(userNumber);
        }
    }
}
