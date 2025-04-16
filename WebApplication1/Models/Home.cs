using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Home
    {
        public int ID { get; set; }
        public int userID { get; set; }
        public string UserImg { get; set; }
        public string Name { get; set; }
        public string tagline { get; set; }
        public string aboutme { get; set; }
        public int ServiceID { get; set; }
        public string ServiceName { get; set; }

        public string title { get; set; }
        public string description { get; set; }
        public string featuredImg { get; set; }
        public IFormFile featuredImage { get; set; }

        public string CustomPrice { get; set; }

        public string offerprice { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string requestDate { get; set; }
        public string Status { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public List<Home> SearchServiceList { get; set; }


        public string address { get; set; }
        public int bookingID { get; set; }
        public string dateofbooking { get; set; }
        public string date { get; set; }
        public string time { get; set; }

        public string todayEarning { get; set; }
        public string yesterdayEarning { get; set; }
        public string weeklyEarning { get; set; }
        public string monthlyEarning { get; set; }


        //public int[] Q_ResponseID { get; set; }
        //public string[] Response { get; set; }
        //public string[] Comment { get; set; }
        //public Array checkbox { get; set; }
    }
}