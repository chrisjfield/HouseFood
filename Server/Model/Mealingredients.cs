using System;
using System.Collections.Generic;

namespace HouseMoneyAPI.Model
{
    public partial class Mealingredients
    {
        public int Mealid { get; set; }
        public int Ingredientid { get; set; }
        public int Amount { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Meals Meal { get; set; }
    }
}
