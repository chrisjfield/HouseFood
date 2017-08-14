using System;
using System.Linq;
using HouseFoodAPI;

namespace HouseFoodAPI.Validation
{
    public class PeopleValidation
    {
        private readonly HouseFoodContext _context;
        public PeopleValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void PersonShouldExist(int Personid)
        {
            if (_context.People.Where(i => i.Personid == Personid).Count() == 0)
            {
                throw new Exception(message: $"Person {Personid.ToString()} does not exists");
            }
        }
    }
}
