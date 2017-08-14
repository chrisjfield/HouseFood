using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HouseFoodAPI.Model;
using HouseFoodAPI.Helpers;
using HouseFoodAPI.Validation;

namespace HouseFoodAPI.Controllers
{
    [Route("api/[controller]")]
    public class PeopleController : Controller
    {
        public PeopleController(HouseFoodContext context)
        {
            _context = context;
            Validation = new PeopleValidation(context: _context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private PeopleValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.People.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Personid}")]
        public IActionResult Get(int Personid)
        {
            try
            {
                var Response = _context.People.Find(Personid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Personid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]People Person)
        {
            try
            {
                var Response = _context.People.Add(Person).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Person);
            }
        }

        // PUT
        [HttpPut("{Personid}")]
        public IActionResult Put(int Personid, [FromBody]People Person)
        {
            try
            {
                Validation.PersonShouldExist(Personid);

                Person.Personid = Personid;
                var Response = _context.People.Update(Person).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Personid, Person);
            }
        }

        // DELETE
        [HttpDelete("{Personid}")]
        public IActionResult Delete(int Personid)
        {
            try
            {
                Validation.PersonShouldExist(Personid);

                var Response = _context.People.Remove(_context.People.Find(Personid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Personid);
            }
        }
    }
}
