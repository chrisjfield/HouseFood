using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Lists
    {
        public Lists()
        {
            Listitems = new HashSet<Listitems>();
        }

        public int Listid { get; set; }
        public string Name { get; set; }
        public DateTime? Datecreated { get; set; }
        public bool Complete { get; set; }
        public DateTime? Datecompleted { get; set; }

        public virtual ICollection<Listitems> Listitems { get; set; }
    }
}
