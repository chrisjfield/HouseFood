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
        public IActionResult Post([FromBody]People[] People)
        {
            try
            {
                List<People> Response = new List<People>();
                foreach (People person in People) {
                    var IndividualResponse = _context.People.Add(person).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, People);
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
        [HttpDelete]
        public IActionResult Delete([FromBody]People[] People)
        {
            try
            {
                List<People> Response = new List<People>();
                foreach (People person in People) {
                    Validation.PersonShouldExist(person.Personid);
                    var IndividualResponse = _context.People.Remove(_context.People.Find(person.Personid)).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, People);
            }
        }
    }
}
