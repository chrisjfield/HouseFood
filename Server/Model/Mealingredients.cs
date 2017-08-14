using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Mealingredients
    {
        public int Mealingredientid { get; set; }
        public int Mealid { get; set; }
        public int Ingredientid { get; set; }
        public int Amount { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Meals Meal { get; set; }
    }
}
