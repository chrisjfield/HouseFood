using System;
using System.Collections.Generic;

namespace HouseFoodAPI.Model
{
    public partial class Listitems
    {
        public int Listitemid { get; set; }
        public int Listid { get; set; }
        public int Ingredientid { get; set; }
        public decimal Amount { get; set; }
        public bool Complete { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Lists List { get; set; }
    }
}
