using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HouseMoneyAPI.Model;
using HouseFoodAPI.Helpers;

namespace HouseMoneyAPI.Controllers
{
    [Route("api/[controller]")]
    public class IngredientsController : Controller
    {
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            var Handler = new ApiHelper();

            try
            {
                using (HouseFoodContext db = new HouseFoodContext())
                {
                    var Response = db.Ingredients.ToList();
                    return Handler.HandleGetResponse(Response);
                }
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
            var Handler = new ApiHelper();

            try
            {
                using (HouseFoodContext db = new HouseFoodContext())
                {
                    var Response = db.Ingredients.Find(Ingredientid);
                    return Handler.HandleGetResponse(Response);
                }
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
            var Handler = new ApiHelper();

            try
            {
                using (HouseFoodContext db = new HouseFoodContext())
                {
                    var Response = db.Ingredients.Add(Ingredient).Entity;
                    db.SaveChanges();
                    return Handler.HandlePostResponse(Response);
                }
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Ingredient);
            }
        }

        // PUT
        [HttpPut("{Ingredientid}")]
        public IActionResult Put(int Ingredientid, [FromBody]Ingredients Ingredient)
        {
            var Handler = new ApiHelper();

            try
            {
                using (HouseFoodContext db = new HouseFoodContext())
                {
                    Ingredient.Ingredientid = Ingredientid;
                    var Response = db.Ingredients.Update(Ingredient).Entity;
                    db.SaveChanges();
                    return Handler.HandlePutResponse(Response);
                }
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
            var Handler = new ApiHelper();

            try
            {
                using (HouseFoodContext db = new HouseFoodContext())
                {
                    if (db.Ingredients.Where(i => i.Ingredientid == Ingredientid).Count() > 0)
                    {
                        var Response = db.Ingredients.Remove(db.Ingredients.Find(Ingredientid)).Entity;
                        db.SaveChanges();
                        return Handler.HandleDeleteResponse(Response);
                    } 
                    return NotFound("No item found to delete");
                }
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Ingredientid);
            }
        }
    }
}
