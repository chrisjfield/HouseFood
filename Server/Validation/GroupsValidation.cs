using System;
using System.Linq;
using HouseFoodAPI;

namespace HouseFoodAPI.Validation
{
    public class GroupsValidation
    {
        private readonly HouseFoodContext _context;
        public GroupsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void GroupShouldExist(int Groupid)
        {
            if (_context.Groups.Where(i => i.Groupid == Groupid).Count() == 0)
            {
                throw new Exception(message: $"Group {Groupid.ToString()} does not exists");
            }
        }
    }
}
