using System;
using System.Collections.Generic;

namespace HouseMoneyAPI.Model
{
    public partial class Groups
    {
        public Groups()
        {
            Groupingredients = new HashSet<Groupingredients>();
        }

        public int Groupid { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Groupingredients> Groupingredients { get; set; }
    }
}
