using System;
using System.Collections.Generic;

namespace HouseMoneyAPI.Model
{
    public partial class People
    {
        public DateTime Date { get; set; }
        public string Person { get; set; }

        public virtual Days DateNavigation { get; set; }
    }
}
