using System;
using System.Linq;
using HouseMoneyAPI;

namespace HouseFoodAPI.Validation
{
    public class IngredientsValidation
    {
        private readonly HouseFoodContext _context;
        public IngredientsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void IngredientShouldExist(int Ingredientid)
        {
            if (_context.Ingredients.Where(i => i.Ingredientid == Ingredientid).Count() == 0)
            {
                throw new Exception("Ingredient " + Ingredientid.ToString() + " does not exists");
            }
        }
    }
}
