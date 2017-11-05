using System;
using Cassandra;
using UserGeneratorBaseOnDatabase.DAL;
using UserGeneratorBaseOnDatabase.Models;
using UserGeneratorBaseOnDatabase.Utils;

namespace UserGeneratorBaseOnDatabase.Generators
{
    public class UserAutoGenerator
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
                u.Birthdate = RandomUtils.GetRadomDate();
                u.City = CITY + i;
                userDAL.addUser(u);
            }
        }
    }
}
