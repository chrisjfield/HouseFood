using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HouseFoodAPI.Model;
using HouseFoodAPI.Helpers;
using HouseFoodAPI.Validation;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;

namespace HouseFoodAPI.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowAllHeaders")]
    public class MealingredientsController : Controller
    {
        public MealingredientsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new MealingredientsValidation(context: _context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private MealingredientsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Mealingredients.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Mealingredientid}")]
        public IActionResult Get(int Mealingredientid)
        {
            try
            {
                var Response = _context.Mealingredients.Find(Mealingredientid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealingredientid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Mealingredients Mealingredient)
        {
            try
            {
                var Response = _context.Mealingredients.Add(Mealingredient).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealingredient);
            }
        }

        // PUT
        [HttpPut("{Mealingredientid}")]
        public IActionResult Put(int Mealingredientid, [FromBody]Mealingredients Mealingredient)
        {
            try
            {
                Validation.MealIngredientShouldExist(Mealingredientid);

                Mealingredient.Mealingredientid = Mealingredientid;
                var Response = _context.Mealingredients.Update(Mealingredient).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealingredientid, Mealingredient);
            }
        }

        [HttpPut("bulk")]
        public IActionResult BulkPut([FromBody]Mealingredients[] Mealingredients)
        {
            try
            {
                List<Mealingredients> Response = new List<Mealingredients>();
                foreach (Mealingredients mealingredients in Mealingredients) {
                    Validation.MealIngredientShouldExist(mealingredients.Mealingredientid);

                    var IndividualResponse = _context.Mealingredients.Update(mealingredients).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealingredients);
            }
        }

        // DELETE
        [HttpDelete("{Mealingredientid}")]
        public IActionResult Delete(int Mealingredientid)
        {
            try
            {
                Validation.MealIngredientShouldExist(Mealingredientid);

                var Response = _context.Mealingredients.Remove(_context.Mealingredients.Find(Mealingredientid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealingredientid);
            }
        }

        [HttpDelete("bulk")]
        public IActionResult BulkDelete([FromBody]Mealingredients[] Mealingredients)
        {
            try
            {
                List<Mealingredients> Response = new List<Mealingredients>();
                foreach (Mealingredients mealingredients in Mealingredients) {
                    Validation.MealIngredientShouldExist(mealingredients.Mealingredientid);

                    var IndividualResponse = _context.Mealingredients
                        .Remove(_context.Mealingredients
                        .Find(mealingredients.Mealingredientid)).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Mealingredients);
            }
        }
    }
}
