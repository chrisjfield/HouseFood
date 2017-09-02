using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HouseFoodAPI.Model;
using HouseFoodAPI.Helpers;
using HouseFoodAPI.Validation;
using Microsoft.AspNetCore.Cors;

namespace HouseFoodAPI.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowAllHeaders")]
    public class IngredientsController : Controller
    {
        public IngredientsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new IngredientsValidation(context: _context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private IngredientsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Ingredients.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Ingredientid}")]
        public IActionResult Get(int Ingredientid)
        {
            try
            {
                var Response = _context.Ingredients.Find(Ingredientid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Ingredientid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Ingredients Ingredient)
        {
            try
            {
                var Response = _context.Ingredients.Add(Ingredient).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Ingredient);
            }
        }

        [HttpPost("bulk")]
        public IActionResult BulkPost([FromBody]Ingredients[] ingredients)
        {
            try
            {
                List<Ingredients> Response = new List<Ingredients>();
                foreach (Ingredients ingredient in ingredients) {
                    var IndividualResponse = _context.Ingredients.Add(ingredient).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, ingredients);
            }
        }

        // PUT
        [HttpPut("{Ingredientid}")]
        public IActionResult Put(int Ingredientid, [FromBody]Ingredients Ingredient)
        {
            try
            {
                Validation.IngredientShouldExist(Ingredientid);

                Ingredient.Ingredientid = Ingredientid;
                var Response = _context.Ingredients.Update(Ingredient).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Ingredientid, Ingredient);
            }
        }

        // DELETE
        [HttpDelete("{Ingredientid}")]
        public IActionResult Delete(int Ingredientid)
        {
            try
            {
                Validation.IngredientShouldExist(Ingredientid);

                var Response = _context.Ingredients.Remove(_context.Ingredients.Find(Ingredientid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Ingredientid);
            }
        }
    }
}
