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
    public class DaysController : Controller
    {
        public DaysController(HouseFoodContext context)
        {
            _context = context;
            Validation = new DaysValidation(_context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private DaysValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Days.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Date}")]
        public IActionResult Get(DateTime Date)
        {
            try
            {
                var Response = _context.Days.Find(Date);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Date);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Days Day)
        {
            try
            {
                var Response = _context.Days.Add(Day).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Day);
            }
        }

        // PUT
        [HttpPut("{Date}")]
        public IActionResult Put(DateTime Date, [FromBody]Days Day)
        {
            try
            {
                Validation.DateShouldExist(Date);

                Day.Date = Date;
                var Response = _context.Days.Update(Day).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Date, Day);
            }
        }

        // DELETE
        [HttpDelete("{Date}")]
        public IActionResult Delete(DateTime Date)
        {
            try
            {
                Validation.DateShouldExist(Date);

                var Response = _context.Days.Remove(_context.Days.Find(Date)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Date);
            }
        }
    }
}
