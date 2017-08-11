using System;
using System.Collections.Generic;

namespace HouseMoneyAPI.Model
{
    public partial class Listitems
    {
        public int Listid { get; set; }
        public int Ingredientid { get; set; }
        public int Amount { get; set; }
        public bool Complete { get; set; }

        public virtual Ingredients Ingredient { get; set; }
        public virtual Lists List { get; set; }
    }
}
