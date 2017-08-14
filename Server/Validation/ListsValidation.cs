using System;
using System.Linq;
using HouseFoodAPI;

namespace HouseFoodAPI.Validation
{
    public class ListsValidation
    {
        private readonly HouseFoodContext _context;
        public ListsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void ListShouldExist(int Listid)
        {
            if (_context.Lists.Where(i => i.Listid == Listid).Count() == 0)
            {
                throw new Exception(message: $"List {Listid.ToString()} does not exists");
            }
        }
    }
}
