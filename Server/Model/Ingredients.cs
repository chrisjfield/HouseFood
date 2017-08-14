using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Ingredients
    {
        public Ingredients()
        {
            Groupingredients = new HashSet<Groupingredients>();
            Listitems = new HashSet<Listitems>();
            Mealingredients = new HashSet<Mealingredients>();
        }

        public int Ingredientid { get; set; }
        public string Name { get; set; }
        public string Units { get; set; }

        public virtual ICollection<Groupingredients> Groupingredients { get; set; }
        public virtual ICollection<Listitems> Listitems { get; set; }
        public virtual ICollection<Mealingredients> Mealingredients { get; set; }
    }
}
