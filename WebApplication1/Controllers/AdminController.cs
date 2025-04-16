using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using WebApplication1.Hubs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class AdminController : Controller
    {
        private readonly CrudClass Cc;

        public AdminController(IConfiguration configuration, IHubContext<ChatHub> hubContext, IWebHostEnvironment env)
        {
            Cc = new CrudClass(configuration);
            _hubContext = hubContext;
            _env = env;
        }
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IWebHostEnvironment _env;


        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }

        public JsonResult GetEarning()
        {
            List<Home> GetEarning = new List<Home>();
            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        GetEarning = Cc.SelectAdmin("GetEarning", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GetEarning);
        }

        public IActionResult UserList()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        public JsonResult Getuserlist()
        {
            List<login> Getuserlist = new List<login>();
            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        Getuserlist = Cc.loginSession("Getuserlist", "0", "0").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(Getuserlist);
        }
        public JsonResult Getuserlistactive()
        {
            List<login> Getuserlistactive = new List<login>();
            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        Getuserlistactive = Cc.loginSession("Getuserlistactive", "0", "0").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(Getuserlistactive);
        }
        
        public IActionResult UserActive([FromBody] Home data)
        {
            string status = "";
            if (data == null)
            {
                return BadRequest("Invalid data received.");
            }
            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        string values = "";
                        if (data.Status == "active")
                        {
                            values = "isdelete='false'";
                            status = Cc.UpdationMethodReturn("updateUser", values, data.ID.ToString());
                        }
                        else
                        {
                            values = "isdelete='true'";
                            status = Cc.UpdationMethodReturn("updateUser", values, data.ID.ToString());
                        }
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(status);
        }


        public IActionResult history()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        public JsonResult GethistoryList()
        {
            List<Home> GethistoryList = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                    var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                    GethistoryList = Cc.SelectAdmin("HistoryList", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GethistoryList);
        }


        //service page
        public IActionResult service()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                List<Home> serviceList = Cc.SelectAdmin("serviceList", "0", "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                ViewBag.serviceListVB = new SelectList(serviceList, "ServiceID", "ServiceName");
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        public JsonResult GetserviceList()
        {
            List<Home> GetserviceList = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        GetserviceList = Cc.SelectAdmin("userserviceList", Userid.ToString() , "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GetserviceList);
        }
        public JsonResult SaveService(Home model)
        {
            string status = "";
            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var userId = HttpContext.Session.GetInt32("user_credential_id");

                        string field = "UserID , ServiceID";
                        string values = "'" + userId + "','" + model.ServiceID + "'";
                        status = Cc.InsertionMethodStatus("setPostService", field, values);
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
        
            return Json(status);
        }
        public IActionResult DeletePost([FromBody] Home data)
        {
            string status = "";
            if (data == null)
            {
                return BadRequest("Invalid data received.");
            }
            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        string values = "";

                        values = "isdelete='true'";
                        status = Cc.UpdationMethodReturn("deletepost", values, data.ID.ToString());
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(status);
        }


        public JsonResult GetServicePostadmin()
        {
            List<Home> GetServicePostadmin = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        GetServicePostadmin = Cc.SelectAdmin("GetServicePostadmin", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GetServicePostadmin);
        }
        public IActionResult PostRequests()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        //service page

        //setting
        public IActionResult setting()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                List<Home> loginType = Cc.SelectAdmin("LoginType", "0000-00-00", "0000-00-00", "0", "0");
                ViewBag.loginTypeVB = new SelectList(loginType, "login_type_id", "login_type");
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        public JsonResult Getprofile()
        {
            List<login> Getprofile = new List<login>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        Getprofile = Cc.loginSession("GetProfile", Userid.ToString(), "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }

                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(Getprofile);
        }
        //setting

        //Request List
        public IActionResult requestList()
        {
            if (HttpContext.Session.GetString("Login") != null)
            {
                logindata();
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }
        public JsonResult GetRequestList()
        {
            List<Home> GetRequestList = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        GetRequestList = Cc.SelectAdmin("RequestList", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GetRequestList);
        }
        public JsonResult GetPostRequests()
        {
            List<Home> GetPostRequests = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        GetPostRequests = Cc.SelectAdmin("GetPostRequests", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GetPostRequests);
        }
        public JsonResult GetAcceptPost()
        {
            List<Home> GetAcceptPost = new List<Home>();

            if (Cc.CheckForInternetConnection() == true)
            {
                if (Cc.DatabaseConnectionCheck() == true)
                {
                    if (HttpContext.Session.GetString("Login") != null)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        GetAcceptPost = Cc.SelectAdmin("GetAcceptPost", Userid.ToString(), "0000-00-00", "0000-00-00", "0000-00-00").ToList();
                    }
                    else
                    {
                        RedirectToAction("Login", "Home");
                    }
                }
                else
                {
                    TempData["DbVarification"] = "UnConnected";
                }
            }
            else
            {
                TempData["NetVarification"] = "UnConnected";
            }
            return Json(GetAcceptPost);
        }

        [HttpPost]
        public async Task<IActionResult> PostService(Home model)
        {
            string status = "";
            var userId = HttpContext.Session.GetInt32("user_credential_id");

            string folderPath = Path.Combine(_env.WebRootPath, "admin_assets", "images");

            // Create directory if it doesn't exist
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var picture = model.featuredImage; // IFormFile

            if (picture != null && picture.Length > 0)
            {
                // Optional: Generate a unique file name
                string fileName = Path.GetFileName(picture.FileName);
                string fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await picture.CopyToAsync(stream);
                    //picture.CopyToAsync(stream);
                }
                string field = "Title , Description, CustomPrice , Featured_img, UserID";
                string values = "'" + model.title + "','" + model.description + "','" + model.CustomPrice + "','" + fileName + "','" + userId + "' ";
                status = Cc.InsertionMethodStatus("setPostService", field, values);
            }

            return Json(status);
        }
        public IActionResult updatebooking([FromBody] Home data)
        {
            if (data == null)
            {
                return BadRequest("Invalid data received.");
            }
            var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
            string name = HttpContext.Session.GetString("user_name").ToString();

            string status = "";
            string values = "status='" + data.Status + "'";
            status = Cc.UpdationMethodReturn("updatebooking", values, data.bookingID.ToString());

            //Task<IActionResult> task = SendNotification(data.userID.ToString(), name, "message_txt", "Offer");

            return Json(status);
        }


        public IActionResult Offer([FromBody] Home request)
        {
            if (request == null)
            {
                return BadRequest("Invalid data received.");
            }
            double lat = request.Lat;
            double lng = request.Lng;

            string status = "";
            string values = null;
            var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
            string name = HttpContext.Session.GetString("user_name").ToString();
            
            values = "Price='" + request.offerprice + "',RequestDate='" + DateTime.Now + "'";
            status = Cc.UpdationMethodReturn("updateRequest", values, request.ID.ToString() );

            Task<IActionResult> task = SendNotification(request.userID.ToString(), name, "message_txt", "Offer");
            return Json(status);
        }
        public JsonResult SetOnline([FromBody] Home request)
        {
            string status = "";
            string values = null;
            try
            {
                if (Cc.CheckForInternetConnection() == true)
                {
                    if (Cc.DatabaseConnectionCheck() == true)
                    {
                        var Userid = HttpContext.Session.GetInt32("user_credential_id").ToString();
                        if (request.Status == "True")
                        {
                            values = "Latitude='" + request.Lat + "',Longitude='" + request.Lng + "',isonline='1'";
                            status = Cc.UpdationMethodReturn("updateUser", values, Userid.ToString() );
                        }
                        else
                        {
                            values = "Latitude='" + request.Lat + "',Longitude='" + request.Lng + "',isonline='0'";
                            status = Cc.UpdationMethodReturn("updateUser", values, Userid.ToString());
                        }
                        if (status == "Saved")
                        {
                            HttpContext.Session.SetString("isonline", request.Status.ToString());
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
            }
            catch (Exception ex)
            {
                return Json(ex.ToString());
            }
            return Json(status);
        }
        //Request List

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
        [HttpPost]
        public async Task<IActionResult> SendNotification(string userId, string name, string message_txt, string type)
        {
            await _hubContext.Clients.All.SendAsync("broadcastMessage", userId, name, message_txt, type);
            return Ok(new { message = "Notification sent!" });
        }
    }
}