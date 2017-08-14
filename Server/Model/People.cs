using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class People
    {
        public int Personid { get; set; }
        public DateTime Date { get; set; }
        public string Person { get; set; }

        public virtual Days DateNavigation { get; set; }
    }
}
