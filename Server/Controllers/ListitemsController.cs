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

        [HttpPost("bulk")]
        public IActionResult BulkPost([FromBody]Listitems[] Listitems)
        {
            try
            {
                List<Listitems> Response = new List<Listitems>();
                foreach (Listitems listitem in Listitems) {
                    var IndividualResponse = _context.Listitems.Add(listitem).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitems);
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

        [HttpPut("bulk")]
        public IActionResult BulkPut([FromBody]Listitems[] Listitem)
        {
            try
            {
                List<Listitems> Response = new List<Listitems>();
                foreach (Listitems listitem in Listitem) {
                    Validation.ListItemShouldExist(listitem.Listitemid);

                    var IndividualResponse = _context.Listitems.Update(listitem).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitem);
            }
        }

        [HttpPut("bulk/{Listid}")]
        public IActionResult BulkCheck(int Listid, [FromBody]bool isChecked)
        {
            try
            {
                var rowsAffected = _context.Database.ExecuteSqlCommand("UPDATE LISTITEMS SET COMPLETE = {0} WHERE LISTID = {1}", isChecked, Listid);
                _context.SaveChanges();
                return Handler.HandleBulkCheckResponse(rowsAffected);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listid, isChecked);
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

        [HttpDelete("bulk")]
        public IActionResult BulkDelete([FromBody]Listitems[] Listitems)
        {
            try
            {
                List<Listitems> Response = new List<Listitems>();
                foreach (Listitems listitem in Listitems) {
                    Validation.ListItemShouldExist(listitem.Listitemid);

                    var IndividualResponse = _context.Listitems
                        .Remove(_context.Listitems
                        .Find(listitem.Listitemid)).Entity;
                    Response.Add(IndividualResponse);
                }
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Listitems);
            }
        }
    }
}
