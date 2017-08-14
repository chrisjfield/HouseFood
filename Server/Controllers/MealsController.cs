using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HouseMoneyAPI.Model;
using HouseFoodAPI.Helpers;
using HouseFoodAPI.Validation;

namespace HouseMoneyAPI.Controllers
{
    [Route("api/[controller]")]
    public class MealsController : Controller
    {
        public MealsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new MealsValidation(_context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private MealsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Meals.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Mealid}")]
        public IActionResult Get(int Mealid)
        {
            try
            {
                var Response = _context.Meals.Find(Mealid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Meals Meal)
        {
            try
            {
                var Response = _context.Meals.Add(Meal).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Meal);
            }
        }

        // PUT
        [HttpPut("{Mealid}")]
        public IActionResult Put(int Mealid, [FromBody]Meals Meal)
        {
            try
            {
                Validation.MealShouldExist(Mealid);

                Meal.Mealid = Mealid;
                var Response = _context.Meals.Update(Meal).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealid, Meal);
            }
        }

        // DELETE
        [HttpDelete("{Mealid}")]
        public IActionResult Delete(int Mealid)
        {
            try
            {
                Validation.MealShouldExist(Mealid);

                var Response = _context.Meals.Remove(_context.Meals.Find(Mealid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealid);
            }
        }
    }
}
