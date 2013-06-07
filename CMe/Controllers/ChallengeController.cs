using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CMe.Models;
using CMe.Common;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MongoDB.Driver.Builders;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.IO;
//using System.Collections.Specialized;

namespace CMe.Controllers
{
    public class ChallengeController : Controller
    {

        private static JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };

        public JsonResult GetById(string oid)
        {
            MongoCollection c = DB.GetChallengesCollection();
            var challengeObj = (from challenge in c.AsQueryable<Challenge>()
                             where challenge.Id == new ObjectId(oid)
                             select challenge).FirstOrDefault<Challenge>();
            return Json(challengeObj.ToJson(jsonWriterSettings), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteById(string oid)
        {
            WriteConcernResult res = DB.GetChallengesCollection().Remove(Query.EQ("_id", ObjectId.Parse(oid)));
            return Json(new {error = false}, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAll()
        {
            MongoCollection c = DB.GetChallengesCollection();
            var challenges = from challenge in c.AsQueryable<Challenge>()
                             select challenge;
            return Json(challenges, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetChallengesAssignedToMe()
        {
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];
            MongoCollection c = DB.GetChallengesCollection();
            var challenges = from challenge in c.AsQueryable<Challenge>()
                             where challenge.assignments.Any(item => item.assignedToLoginId == currentUser.loginId)
                             orderby challenge.postedDate descending
                             select challenge;
            return Json(challenges.ToJson(jsonWriterSettings), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetMyChallenges()
        {
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];
            MongoCollection c = DB.GetChallengesCollection();
            var challenges = from challenge in c.AsQueryable<Challenge>()
                             where challenge.creatorLoginId == currentUser.loginId
                             orderby challenge.postedDate descending
                             select challenge;
            return Json(challenges.ToJson(jsonWriterSettings), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetChallengesAssignedTo(string loginId)
        {
            MongoCollection c = DB.GetChallengesCollection();
            var challenges = from challenge in c.AsQueryable<Challenge>()
                             where challenge.assignments.Any(assignment =>
                                 assignment.assignedToLoginId == loginId)
                             select challenge;
            return Json(challenges, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveChallenge(Challenge challenge) {
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];
            string editMode = Request.Form["editMode"];

            challenge.creatorName = currentUser.fullName;
            challenge.creatorLoginId = currentUser.loginId;
            challenge.postedDate = DateTime.Now;
            challenge.creatorEmail = currentUser.emailAddress;


            foreach (string paramName in Request.Form){
                if (paramName.StartsWith("assignedToLoginId-")) {
                    string assignedToLoginId = Request.Form[paramName];
                    string hoursWorked = Request.Form["hoursWorked-" + assignedToLoginId];
                    Assignment assignment = new Assignment();
                    assignment.assignedToLoginId = assignedToLoginId;
                    assignment.hoursWorked = string.IsNullOrEmpty(hoursWorked) ? 0 : int.Parse(hoursWorked);
                    challenge.assignments.Add(assignment);
                }
            }

            if (challenge.keywords[0].Equals("")) {
                challenge.keywords.Clear();
            }else{
                challenge.keywords = new List<string>(challenge.keywords[0].Split(','));
            }

            if (editMode == "INSERT") {
                DB.GetChallengesCollection().Insert(challenge);
            }else{
                string oid = Request.Form["oid"];
                Challenge challengeToUpdate = DB.GetChallengesCollection().FindOne(Query.EQ("_id", ObjectId.Parse(oid)));
                challengeToUpdate.creatorLoginId = challenge.creatorLoginId;
                challengeToUpdate.creatorName = challenge.creatorName;
                challengeToUpdate.creatorEmail = challenge.creatorEmail;
                challengeToUpdate.postedDate = challenge.postedDate;
                challengeToUpdate.deadlineDate = challenge.deadlineDate;
                challengeToUpdate.challengeTitle = challenge.challengeTitle;
                challengeToUpdate.challengeDescription = challenge.challengeDescription;
                challengeToUpdate.hoursNeeded = challenge.hoursNeeded;
                challengeToUpdate.status = challenge.status;
                challengeToUpdate.keywords = challenge.keywords;
                challengeToUpdate.assignments = challenge.assignments;


                DB.GetChallengesCollection().Update(Query.EQ("_id", ObjectId.Parse(oid)), Update.Replace<Challenge>(challengeToUpdate));

                /*
                                var update = Update.Set("creatorLoginId", challenge.creatorLoginId)
                                    .Set("creatorName", challenge.creatorName)
                                    .Set("creatorEmail", challenge.creatorEmail)
                                    .Set("postedDate", challenge.postedDate)
                                    .Set("deadlineDate", challenge.deadlineDate)
                                    .Set("challengeTitle", challenge.challengeTitle)
                                    .Set("challengeDescription", challenge.challengeDescription)
                                    .Set("hoursNeeded", challenge.hoursNeeded)
                                    .AddToSetEachWrapped<string>("keywords", challenge.keywords)
                                    .Set("assignments", challenge.assignments.ToBsonDocument())
                                    .Set("status", challenge.status);
                                DB.GetChallengesCollection().Update(Query.EQ("_id", ObjectId.Parse(oid)), update);
                                    //Update.Replace<Challenge>(challenge));
                  
                */
                //.AddToSetEachWrapped<Assignment>("assignments", challenge.assignments)


                //TIP: First retrieve the Challenge then update fields and then replace!!!!

            }

            return Json(new { error = false, data = challenge}, JsonRequestBehavior.AllowGet);
        }

    }
}
