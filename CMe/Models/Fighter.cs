using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;

namespace CMe.Models
{
    public class Fighter
    {
        public ObjectId Id { get; set; }
        public string loginId { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string profileText { get; set; }
        public int hoursAvailable { get; set; }
        public List<string> keywords { get; set; }
    }
}