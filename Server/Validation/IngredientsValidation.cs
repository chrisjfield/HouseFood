using System;
using System.Linq;
using HouseMoneyAPI;

namespace HouseFoodAPI.Validation
{
    public class IngredientsValidation
    {
        public void IngredientShouldExist(int Ingredientid)
        {
            using (HouseFoodContext db = new HouseFoodContext())
            {
                if (db.Ingredients.Where(i => i.Ingredientid == Ingredientid).Count() == 0)
                {
                    throw new Exception("Ingredient " + Ingredientid.ToString() + " does not exists");
                }
            }
        }
    }
}
