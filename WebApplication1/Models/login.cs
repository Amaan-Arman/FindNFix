using System.Data.SqlTypes;

namespace WebApplication1.Models
{
    public class login
    {
        public List<login> SearchServiceListcancle { get; set; }
        public int ID { get; set; }
        public int user_credential_id { get; set; }
        public string user_name { get; set; }
        public string login_type { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string login_id { get; set; }
        public string user_mobileNo { get; set; }
        public string user_img { get; set; }
        public string cnic_f { get; set; }
        public string cnic_b { get; set; }
        public string tagline { get; set; }
        public string aboutme { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public bool isonline { get; set; }
        public string otp_num { get; set; }
        public IFormFile user_pic { get; set; }
        public IFormFile front_cnic { get; set; }
        public IFormFile back_cnic { get; set; }
        public string date { get; set; }
        public string active { get; set; }

        public string time { get; set; }


    }
}
