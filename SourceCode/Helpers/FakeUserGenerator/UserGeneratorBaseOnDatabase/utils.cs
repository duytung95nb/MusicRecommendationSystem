

using System;
using System.Collections.Generic;
using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase.Utils
{
    public class RandomUtils
    {
        public static DateTime GetRadomDate()
        {
            Random gen = new Random();
            DateTime start = new DateTime(1995, 1, 1);
            int range = (DateTime.Today - start).Days;
            return start.AddDays(gen.Next(range));
        }
        public static string GetRandomStringInList(List<string> array)
        {
            var random = new Random();
            int index = random.Next(0, array.Count);
            return array[index];
        }
        public static int GetRandomNumberInRange(int start, int end)
        {
            Random random = new Random();
            int randomNumber = random.Next(start, end);
            return randomNumber;
        }
        public static Song GetRandomSongInList(List<Song> songs) 
        {
            var random = new Random();
            int index = random.Next(0, songs.Count);
            return songs[index];
        }
    }
}