using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CMe.Common
{
    public class CurrentUser
    {
        public string loginId { get; set; }
        public string fullName { get; set; }
        public string emailAddress { get; set; }
        public string employeeId { get; set; }
        public string givenName { get; set; }
        public string surname { get; set; }
    }
}