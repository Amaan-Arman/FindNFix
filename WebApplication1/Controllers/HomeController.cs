using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using System;
using System.Data.SqlTypes;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Reflection;
using WebApplication1.Hubs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{

    public class HomeController : Controller
    {
        private readonly CrudClass Cc;

        public HomeController(IConfiguration configuration, IHubContext<ChatHub> hubContext )
        {
            Cc = new CrudClass(configuration);
            _hubContext = hubContext;
        }

        private readonly IHubContext<ChatHub> _hubContext;

        public int logindata()
        {
            if (HttpContext.Session.GetString("Login") == null)
            {
                TempData["isonline"] = null;
                TempData["Login"] = null;
                TempData["user_credential_id"] = null;
                TempData["user_name"] = null;
                TempData["login_type"] = null;
                TempData["user_mobileNo"] = null;
                TempData["user_img"] = null;

                return 1;
            }
            else
            {
                TempData["isonline"] = HttpContext.Session.GetString("isonline").ToString().Trim();
                TempData["Login"] = HttpContext.Session.GetInt32("Login").ToString().Trim();
                TempData["user_credential_id"] = HttpContext.Session.GetInt32("user_credential_id").ToString().Trim();
                TempData["user_name"] = HttpContext.Session.GetString("user_name").ToString().Trim();
                TempData["login_type"] = HttpContext.Session.GetString("login_type").ToString().Trim();
                TempData["user_mobileNo"] = HttpContext.Session.GetString("user_mobileNo").ToString().Trim();
                TempData["user_img"] = HttpContext.Session.GetString("user_img").ToString().Trim();

                return 0;
            }
        }

        public IActionResult Index()
        {
            logindata();
            ViewBag.Title = "asd";
            return View();
        }
        public JsonResult getserviceList()
        {
            List<Home> getserviceList = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    getserviceList = Cc.SelectAdmin("serviceList", "0", "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                    return Json("DataBaseError");
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
                return Json("NetworkError");
            }
            return Json(getserviceList);
        }


        [HttpPost]
        public async Task<IActionResult> SendNotification(string userId, string name, string message_txt, string type)
        {
            await _hubContext.Clients.All.SendAsync("broadcastMessage", userId, name, message_txt, type);
            return Ok(new { message = "Notification sent!" });
        }

        [HttpPost]
        public IActionResult BookingRequest(Home modal)
        {
            string status = "";
            if (!Cc.CheckForInternetConnection())
            {
                TempData["NetVarification"] = "UnConnected";
                return Json("NetworkError");
            }

            if (!Cc.DatabaseConnectionCheck())
            {
                TempData["DbVarification"] = "UnConnected";
                return Json("DataBaseError");
            }

            if (HttpContext.Session.GetString("Login") == null)
            {
                return Json(new { redirectTo = Url.Action("Index", "Login") });
            }

            var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
            string name = HttpContext.Session.GetString("user_name").ToString();

            string field = "user_id , user_name, ServiceID, service_name , serviceproviderID, dateofbooking, address, Status";
            string values = "'" + Userid + "','" + name + "','" + modal.ServiceID + "','" + modal.title + "','" + modal.userID + "','" + modal.dateofbooking + "','" + modal.address + "','Pending' ";
            status = Cc.InsertionMethodStatus("setRequestBooking", field, values);

            Task<IActionResult> task = SendNotification(modal.userID.ToString(), name, "message_txt", "Request");
            return Json(status);
        }

        public JsonResult GetServicePost()
        {
            List<Home> GetServicePost = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                    GetServicePost = Cc.SelectHome("GetServicePost", "", "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                    return Json("DataBaseError");
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
                return Json("NetworkError");
            }
            return Json(GetServicePost);
        }
        public JsonResult GetPostDetail(string id)
        {
            List<Home> GetPostDetailList = new List<Home>();

            try
            {
                if (!Cc.CheckForInternetConnection())
                {
                    TempData["NetVarification"] = "UnConnected";
                    return Json("NetworkError");
                }

                if (!Cc.DatabaseConnectionCheck())
                {
                    TempData["DbVarification"] = "UnConnected";
                    return Json("DataBaseError");
                }
                GetPostDetailList = Cc.SelectHome("GetPostDetailList", id.ToString().Trim(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                return Json(GetPostDetailList);
                //if (HttpContext.Session.GetString("Login") == null)
                //{
                //    return Json(new { redirectTo = Url.Action("Index", "Login") });
                //}
                //var userId = HttpContext.Session.GetInt32("user_credential_id");
                //var userName = HttpContext.Session.GetString("user_name");

                //if (userId.HasValue && !string.IsNullOrEmpty(userName))
                //{
                  
                //}
                //else
                //{
                //    return Json(new { redirectTo = Url.Action("Index", "Login") });
                //}
            }
            catch (Exception ex)
            {
                TempData["ExceptionError"] = "ExceptionError";
                Console.WriteLine("Error: " + ex.Message);
                return Json("ExceptionError");
            }
        }

        public JsonResult SearchService(string id)
        {
            List<Home> SearchServiceList = new List<Home>();

            try
            {
                if (!Cc.CheckForInternetConnection())
                {
                    TempData["NetVarification"] = "UnConnected";
                    return Json("NetworkError");
                }

                if (!Cc.DatabaseConnectionCheck())
                {
                    TempData["DbVarification"] = "UnConnected";
                    return Json("DataBaseError");
                }

                if (HttpContext.Session.GetString("Login") == null)
                {
                    return Json(new { redirectTo = Url.Action("Index", "Login") });
                }

                var userId = HttpContext.Session.GetInt32("user_credential_id");
                var userName = HttpContext.Session.GetString("user_name");

                if (userId.HasValue && !string.IsNullOrEmpty(userName))
                {
                    SearchServiceList = Cc.SelectHome("SearchServiceList", id.ToString().Trim(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    return Json(SearchServiceList);
                }
                else
                {
                    return Json(new { redirectTo = Url.Action("Index", "Login") });
                }
            }
            catch (Exception ex)
            {
                TempData["ExceptionError"] = "ExceptionError";
                Console.WriteLine("Error: " + ex.Message);
                return Json("ExceptionError");
            }
        }

        public JsonResult GetTrackPostRequests()
        {
            List<Home> GetTrackPostRequests = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        string name = HttpContext.Session.GetString("user_name").ToString();
                        GetTrackPostRequests = Cc.SelectHome("TrackPostRequests", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        return Json(new { redirectTo = Url.Action("Index", "Login") });
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                    return Json("DataBaseError");
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
                return Json("NetworkError");
            }
            return Json(GetTrackPostRequests);
        }

        [HttpPost]
        public IActionResult SetRequest([FromBody] Home request)
        {
            string status = "";
            if (request == null || request.SearchServiceList == null)
            {
                return BadRequest("Invalid data received.");
            }
            if ( request.SearchServiceList.Count == 0)
            {
                status = "";
                return Json(status);
            }
            double lat = request.Lat;
            double lng = request.Lng;
            List<Home> searchServiceList = request.SearchServiceList;
           
            foreach (var service in searchServiceList)
            {
                //Console.WriteLine($"Service Name: {service.Name}, ID: {service.ID}");
                var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                string name = HttpContext.Session.GetString("user_name").ToString();
                string field = "UserID , ServiceProviderID, ServiceID , Location_latitude, Location_longitude, Status";
                string values = "'" + Userid + "','" + service.ID + "','" + service.ServiceID + "','" + lat + "','" + lng + "','Pending' ";
                status = Cc.InsertionMethodStatus("setRequest", field, values);

                Task<IActionResult> task = SendNotification(service.ID.ToString(), name, "message_txt", "Request");
            }
            return Json(status);
        }
        [HttpPost]
        public IActionResult cancelRequest([FromBody] login request)
        {
            string status = "";
            if (request == null || request.SearchServiceListcancle.Count == 0)
            {
                //return BadRequest("Invalid data received.");
                status = "Invalid data received.";
                return Json(status);
            }
            foreach (var service in request.SearchServiceListcancle)
            {
                var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                string name = HttpContext.Session.GetString("user_name").ToString();
               
                string values = "isdelete='true'";
                status = Cc.UpdationMethodReturn("updateRequestcancle", values, Userid.ToString());

                Task<IActionResult> task = SendNotification(service.ID.ToString(), name, "message_txt", "Request");
            }
            return Json(status);
        }

        public JsonResult GetOfferList()
        {
            List<Home> GetOfferList = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        string name = HttpContext.Session.GetString("user_name").ToString();
                        GetOfferList = Cc.SelectHome("OfferList", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        return Json(new { redirectTo = Url.Action("Index", "Login") });
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                    return Json("DataBaseError");
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
                return Json("NetworkError");
            }
            return Json(GetOfferList);
        }
        public IActionResult AcceptOffer([FromBody] Home data)
        {
            if (data == null)
            {
                return BadRequest("Invalid data received.");
            }
            double lat = data.Lat;
            double lng = data.Lng;

            string status = "";
            string values = null;
            var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
            string name = HttpContext.Session.GetString("user_name").ToString();

            values = " Status='Accept'" ;
            status = Cc.UpdationMethodReturn("updateRequest", values, data.ID.ToString());

            Task<IActionResult> task = SendNotification(data.userID.ToString(), name.ToString(), "message_txt", "Accept");
            return Json(status);
        }
        public IActionResult CompleteService([FromBody] Home data)
        {
            if (data == null)
            {
                return BadRequest("Invalid data received.");
            }
            string status = "";
            string values = null;

            values = " Status='Completed'";
            status = Cc.UpdationMethodReturn("updateRequest", values, data.ID.ToString());
            return Json(status);
        }


        public JsonResult GetSessionData()
        {
            if (HttpContext.Session.GetInt32("user_credential_id").ToString() != "")
            {
                var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                var isonline = HttpContext.Session.GetString("isonline").ToString();
                return Json(new { userId = Userid, isonline = isonline });
            }
            return Json("");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        //private readonly ILogger<HomeController> _logger;
        //public HomeController(ILogger<HomeController> logger)
        //{
        //    _logger = logger;
        //}
    }
}