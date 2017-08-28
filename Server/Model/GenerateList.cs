using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class GenerateList
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string ListName { get; set; }
    }
}
