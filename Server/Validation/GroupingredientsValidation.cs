using System;
using System.Linq;
using HouseFoodAPI;

namespace HouseFoodAPI.Validation
{
    public class GroupingredientsValidation
    {
        private readonly HouseFoodContext _context;
        public GroupingredientsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void GroupIngredientShouldExist(int Groupingredientid)
        {
            if (_context.Groupingredients.Where(i => i.Groupingredientid == Groupingredientid).Count() == 0)
            {
                throw new Exception(message: $"Group ingredient {Groupingredientid.ToString()} does not exists");
            }
        }
    }
}
