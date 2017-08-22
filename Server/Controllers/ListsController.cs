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
    public class ListsController : Controller
    {
        public ListsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new ListsValidation(context: _context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private ListsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Lists.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Listid}")]
        public IActionResult Get(int Listid)
        {
            try
            {
                var Response = _context.Lists.Find(Listid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Lists List)
        {
            try
            {
                var Response = _context.Lists.Add(List).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, List);
            }
        }

        // PUT
        [HttpPut("{Listid}")]
        public IActionResult Put(int Listid, [FromBody]Lists List)
        {
            try
            {
                Validation.ListShouldExist(Listid);

                List.Listid = Listid;
                var Response = _context.Lists.Update(List).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listid, List);
            }
        }

        // DELETE
        [HttpDelete("{Listid}")]
        public IActionResult Delete(int Listid)
        {
            try
            {
                Validation.ListShouldExist(Listid);

                var Response = _context.Lists.Remove(_context.Lists.Find(Listid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listid);
            }
        }
    }
}
