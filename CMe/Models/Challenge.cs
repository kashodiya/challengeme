using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;

namespace CMe.Models
{
    public class Challenge
    {

        public Challenge()
        {
            assignments = new List<Assignment>();
        }

        public ObjectId Id { get; set; }
        public string creatorLoginId { get; set; }
        public string creatorName { get; set; }
        public string creatorEmail { get; set; }
        public DateTime postedDate { get; set; }
        public DateTime deadlineDate { get; set; }
        public string challengeTitle { get; set; }
        public string challengeDescription { get; set; }
        public int hoursNeeded { get; set; }
        public string status { get; set; }  //OPEN, ASSIGNED, COMPLETED, DROPPED
        public List<string> keywords { get; set; }
        public IList<Assignment> assignments { get; set; }
    }
}