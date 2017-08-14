using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Days
    {
        public Days()
        {
            People = new HashSet<People>();
        }

        public DateTime Date { get; set; }
        public int Mealid { get; set; }
        public int Numberofpeople { get; set; }

        public virtual ICollection<People> People { get; set; }
        public virtual Meals Meal { get; set; }
    }
}
