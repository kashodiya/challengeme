using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CMe.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver.Builders;
using MongoDB.Bson.IO;
using CMe.Common;

namespace CMe.Controllers
{
    public class FighterController : Controller
    {

        private static JsonWriterSettings jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };


        public JsonResult GetMyProfile()
        {
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];
            MongoCollection f = DB.GetFightersCollection();
            var fighterObj = (from fighter in f.AsQueryable<Fighter>()
                             where fighter.loginId == currentUser.loginId
                             select fighter).FirstOrDefault<Fighter>();
            return Json(fighterObj.ToJson(jsonWriterSettings), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAvailableFighters()
        {
            //TODO: Use setFields to only return 2 columns needed.
            /*
            string json = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(
                DB.GetFightersCollection().Find(
                    Query.GT("hoursAvailable", 0)).ToArray<Fighter>());
             */ 

            MongoCollection f = DB.GetFightersCollection();
            var fighters = from fighter in f.AsQueryable<Fighter>()
                           orderby fighter.name
                           select new { fighter.loginId, fighter.name, fighter.hoursAvailable };
            return Json(fighters.ToJson(jsonWriterSettings), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAll()
        {

            MongoCollection f = DB.GetFightersCollection();
            var fighters = from fighter in f.AsQueryable<Fighter>()
                           select fighter;
            return Json(fighters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateFighter(Fighter fighter){
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];

            Fighter fighterToUpdate = DB.GetFightersCollection().FindOne(Query.EQ("loginId", currentUser.loginId));
            fighterToUpdate.email = currentUser.emailAddress;
            fighterToUpdate.loginId = currentUser.loginId;
            fighterToUpdate.name = currentUser.fullName;
            fighterToUpdate.profileText = fighter.profileText;
            fighterToUpdate.hoursAvailable = fighter.hoursAvailable;
            fighterToUpdate.keywords = new List<string>(fighter.keywords[0].Split(','));

            DB.GetFightersCollection().Update(Query.EQ("loginId", currentUser.loginId), Update.Replace<Fighter>(fighterToUpdate), UpdateFlags.Upsert);

            return Json(new { error = false, data = fighter }, JsonRequestBehavior.AllowGet);
        }
/*
        public JsonResult AddFighter(string profileText, int hoursAvailable, string keywordsTxt)
        {
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];
            string loginId = currentUser.loginId;
            List<String> keywords = new List<String>(keywordsTxt.Split(','));
            keywords = keywords.Where(s => !string.IsNullOrWhiteSpace(s))
                .Select(s => s.Trim())
                .Distinct().ToList();
            var fighter = new Fighter { loginId = loginId, profileText = profileText, keywords = keywords };
            MongoCollection fighterCollection = DB.GetFightersCollection();


            fighterCollection.Update(
                Query.EQ("loginId", loginId),
                Update.Replace(fighter),
                UpdateFlags.Upsert);

            return Json(new { error = false, data = fighter}, JsonRequestBehavior.AllowGet);
        }
*/
    }
}
