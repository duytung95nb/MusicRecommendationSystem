using System;
using Cassandra;
using Cassandra.Mapping;
using UserGeneratorBaseOnDatabase.Generators;

namespace UserGeneratorBaseOnDatabase
{
    class Program
    {
        static void Main(string[] args)
        {
            MappingConfiguration.Global.Define<CassandraMapping>();
            Console.WriteLine("Input 1 to generate users, 2 to generate events");
            int caseToProcess = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Case picked: {0}", caseToProcess);
            switch (caseToProcess)
            {
                case 1:
                    UserAutoGenerator userGenerator = new UserAutoGenerator();
                    Console.WriteLine("Input number of user to generate:");
                    int userNumber = Convert.ToInt32(Console.ReadLine());
                    userGenerator.GenerateRandomUserList(userNumber);
                    break;
                case 2:
                default:
                    UserEventGenerator userEventGenerator = new UserEventGenerator();
                    Console.WriteLine("Input number of event per user to generate:");
                    int eventsPerUserCount = Convert.ToInt32(Console.ReadLine());
                    userEventGenerator.GenerateRandomUserEvents(eventsPerUserCount);
                    break;
            }
        }
    }
}
