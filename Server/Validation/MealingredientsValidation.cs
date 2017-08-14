using System;
using System.Linq;
using HouseFoodAPI;

namespace HouseFoodAPI.Validation
{
    public class MealingredientsValidation
    {
        private readonly HouseFoodContext _context;
        public MealingredientsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void MealIngredientShouldExist(int Mealingredientid)
        {
            if (_context.Mealingredients.Where(i => i.Mealingredientid == Mealingredientid).Count() == 0)
            {
                throw new Exception(message: $"Meal Ingredient {Mealingredientid.ToString()} does not exists");
            }
        }
    }
}
