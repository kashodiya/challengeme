using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Driver;

namespace CMe.Models
{
    public class DB
    {
        private static string connectionString = "mongodb://localhost";

        public static MongoCollection<Fighter> GetFightersCollection()
        {
            MongoServer mongoServer = MongoServer.Create(connectionString);
            MongoDatabase db = mongoServer.GetDatabase("cme");
            MongoCollection<Fighter> fighters = db.GetCollection<Fighter>("fighters");
            return fighters;
        }

        public static MongoCollection<Challenge> GetChallengesCollection()
        {
            MongoServer mongoServer = MongoServer.Create(connectionString);
            MongoDatabase db = mongoServer.GetDatabase("cme");
            MongoCollection<Challenge> challenges = db.GetCollection<Challenge>("challenges");
            return challenges;
        }

    }
}