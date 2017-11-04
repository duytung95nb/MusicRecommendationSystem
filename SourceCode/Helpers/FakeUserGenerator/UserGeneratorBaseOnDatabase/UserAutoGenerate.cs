using System;
using Cassandra;
using UserGeneratorBaseOnDatabase.DAL;
using UserGeneratorBaseOnDatabase.Models;

namespace UserGeneratorBaseOnDatabase
{
    public class UserAutoGenerate
    {
        const string USERNAME = "duytung95nb";
        const string PASSWORD = "duytung95nb";
        const string AVATAR_URL = "https://www.w3schools.com/css/trolltunga.jpg";
        const string FIRSTNAME = "Tung";
        const string LASTNAME = "Dao";
        const bool GENDER = false;
        const string CITY = "Sai Gon";
        public void GenerateRandomUserList(int amount)
        {
            UserDAL userDAL = new UserDAL();
            for (int i = 0; i < amount; i++)
            {
                User u = new User();
                u.Username = USERNAME + i;
                u.Password = PASSWORD + i;
                u.AvatarUrl = AVATAR_URL;
                u.Firstname = FIRSTNAME + i;
                u.Lastname = LASTNAME + i;
                u.Gender = i % 2 == 0 ? GENDER : !GENDER;
                u.Birthdate = GetRadomDate();
                u.City = CITY + i;
                userDAL.addUser(u);
            }
        }
        private DateTime GetRadomDate()
        {
            Random gen = new Random();
            DateTime start = new DateTime(1995, 1, 1);
            int range = (DateTime.Today - start).Days;
            return start.AddDays(gen.Next(range));
        }
    }
}
