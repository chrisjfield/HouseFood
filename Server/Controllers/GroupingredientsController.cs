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
    public class GroupingredientsController : Controller
    {
        public GroupingredientsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new GroupingredientsValidation(context: _context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private GroupingredientsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Groupingredients.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Groupingredientid}")]
        public IActionResult Get(int Groupingredientid)
        {
            try
            {
                var Response = _context.Groupingredients.Find(Groupingredientid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupingredientid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Groupingredients Groupingredient)
        {
            try
            {
                var Response = _context.Groupingredients.Add(Groupingredient).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupingredient);
            }
        }

        // PUT
        [HttpPut("{Groupingredientid}")]
        public IActionResult Put(int Groupingredientid, [FromBody]Groupingredients Groupingredient)
        {
            try
            {
                Validation.GroupIngredientShouldExist(Groupingredientid);

                Groupingredient.Groupingredientid = Groupingredientid;
                var Response = _context.Groupingredients.Update(Groupingredient).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupingredientid, Groupingredient);
            }
        }

        // DELETE
        [HttpDelete("{Groupingredientid}")]
        public IActionResult Delete(int Groupingredientid)
        {
            try
            {
                Validation.GroupIngredientShouldExist(Groupingredientid);

                var Response = _context.Groupingredients.Remove(_context.Groupingredients.Find(Groupingredientid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupingredientid);
            }
        }
    }
}
