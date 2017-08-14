using System;
using System.Linq;
using HouseFoodAPI;

namespace HouseFoodAPI.Validation
{
    public class ListitemsValidation
    {
        private readonly HouseFoodContext _context;
        public ListitemsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void ListItemShouldExist(int Listitemid)
        {
            if (_context.Listitems.Where(i => i.Listitemid == Listitemid).Count() == 0)
            {
                throw new Exception(message: $"List item {Listitemid.ToString()} does not exists");
            }
        }
    }
}
