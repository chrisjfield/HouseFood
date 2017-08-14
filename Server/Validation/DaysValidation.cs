using System;
using System.Linq;
using HouseMoneyAPI;

namespace HouseFoodAPI.Validation
{
    public class DaysValidation
    {
        private readonly HouseFoodContext _context;
        public DaysValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void DateShouldExist(DateTime Date)
        {
            if (_context.Days.Where(i => i.Date == Date).Count() == 0)
            {
                throw new Exception("Ingredient " + Date.ToString() + " does not exists");
            }
        }
    }
}
