﻿using System;
using System.Linq;
using HouseMoneyAPI;

namespace HouseFoodAPI.Validation
{
    public class MealsValidation
    {
        private readonly HouseFoodContext _context;
        public MealsValidation(HouseFoodContext context)
        {
            _context = context;
        }

        public void MealShouldExist(int Mealid)
        {
            if (_context.Meals.Where(i => i.Mealid == Mealid).Count() == 0)
            {
                throw new Exception("Ingredient " + Mealid.ToString() + " does not exists");
            }
        }
    }
}
