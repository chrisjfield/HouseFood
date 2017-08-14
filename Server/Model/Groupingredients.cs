using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Groupingredients
    {
        public int Groupingredientid { get; set; }
        public int Groupid { get; set; }
        public int Ingredientid { get; set; }
        public int Amount { get; set; }

        public virtual Groups Group { get; set; }
        public virtual Ingredients Ingredient { get; set; }
    }
}
