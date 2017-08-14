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
    public class ListitemsController : Controller
    {
        public ListitemsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new ListitemsValidation(context: _context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private ListitemsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Listitems.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Listitemid}")]
        public IActionResult Get(int Listitemid)
        {
            try
            {
                var Response = _context.Listitems.Find(Listitemid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitemid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Listitems Listitem)
        {
            try
            {
                var Response = _context.Listitems.Add(Listitem).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitem);
            }
        }

        // PUT
        [HttpPut("{Listitemid}")]
        public IActionResult Put(int Listitemid, [FromBody]Listitems Listitem)
        {
            try
            {
                Validation.ListItemShouldExist(Listitemid);

                Listitem.Listitemid = Listitemid;
                var Response = _context.Listitems.Update(Listitem).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitemid, Listitem);
            }
        }

        // DELETE
        [HttpDelete("{Listitemid}")]
        public IActionResult Delete(int Listitemid)
        {
            try
            {
                Validation.ListItemShouldExist(Listitemid);

                var Response = _context.Listitems.Remove(_context.Listitems.Find(Listitemid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitemid);
            }
        }
    }
}