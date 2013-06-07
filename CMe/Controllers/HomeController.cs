using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CMe.Models;
using System.DirectoryServices.AccountManagement;
using CMe.Common;

namespace CMe.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            string userLogin = User.Identity.Name;
            if (Request.Params["as"] != null) {
                System.Web.HttpContext.Current.Session.Add("runAsLoginId", Request.Params["as"]);
                userLogin = "RB\\" + Request.Params["as"];
            }else{
                System.Web.HttpContext.Current.Session.Remove("runAsLoginId");
            }
            ViewBag.userLogin = userLogin;
            return View();
        }

        public JsonResult UserName()
        {
            //CurrentUser currentUser = new CurrentUser();
            CurrentUser currentUser = (CurrentUser)System.Web.HttpContext.Current.Session["currentUser"];
            string fullName = null;
            string emailAddress = null;
            string employeeId = null;
            string givenName = null;
            string surname = null;
            using (PrincipalContext context = new PrincipalContext(ContextType.Domain, "RB"))
            {
                string domainLogin = User.Identity.Name;
                if (System.Web.HttpContext.Current.Session["runAsLoginId"] != null) {
                    domainLogin = "RB\\" + (string)System.Web.HttpContext.Current.Session["runAsLoginId"];
                }
                using (UserPrincipal user = UserPrincipal.FindByIdentity(context, domainLogin))
                {
                    if (user != null)
                    {
                        currentUser.emailAddress = user.EmailAddress;
                        currentUser.employeeId = user.EmployeeId;
                        currentUser.fullName = user.DisplayName;
                        currentUser.givenName = user.GivenName;
                        currentUser.surname = user.Surname;
                        currentUser.loginId = user.SamAccountName;

                        fullName = user.DisplayName;
                        emailAddress = user.EmailAddress;
                        employeeId = user.EmployeeId;
                        givenName = user.GivenName;
                        surname = user.Surname;
                    }
                }
            }

            var userObj = new
            {
                fullName = fullName,
                emailAddress = emailAddress,
                employeeId = employeeId,
                givenName = givenName,
                surname = surname
            };
            System.Web.HttpContext.Current.Session.Add("currentUser", currentUser);
            return Json(currentUser, JsonRequestBehavior.AllowGet);
        }


        public ActionResult About()
        {
            return View();
        }

    }
}
