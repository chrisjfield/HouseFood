using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Meals
    {
        public Meals()
        {
            Days = new HashSet<Days>();
            Mealingredients = new HashSet<Mealingredients>();
        }

        public int Mealid { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }

        public virtual ICollection<Days> Days { get; set; }
        public virtual ICollection<Mealingredients> Mealingredients { get; set; }
    }
}
