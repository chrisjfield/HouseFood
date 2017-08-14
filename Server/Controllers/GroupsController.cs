using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HouseMoneyAPI.Model;
using HouseFoodAPI.Helpers;
using HouseFoodAPI.Validation;

namespace HouseMoneyAPI.Controllers
{
    [Route("api/[controller]")]
    public class GroupsController : Controller
    {
        public GroupsController(HouseFoodContext context)
        {
            _context = context;
            Validation = new GroupsValidation(_context);
            Handler = new ApiHelper();
        }
        private HouseFoodContext _context;
        private ApiHelper Handler;
        private GroupsValidation Validation;
        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var Response = _context.Groups.ToList();
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex);
            }
        }

        // GET
        [HttpGet("{Groupid}")]
        public IActionResult Get(int Groupid)
        {
            try
            {
                var Response = _context.Groups.Find(Groupid);
                return Handler.HandleGetResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupid);
            }
        }

        // POST
        [HttpPost]
        public IActionResult Post([FromBody]Groups Group)
        {
            try
            {
                var Response = _context.Groups.Add(Group).Entity;
                _context.SaveChanges();
                return Handler.HandlePostResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Group);
            }
        }

        // PUT
        [HttpPut("{Groupid}")]
        public IActionResult Put(int Groupid, [FromBody]Groups Group)
        {
            try
            {
                Validation.GroupShouldExist(Groupid);

                Group.Groupid = Groupid;
                var Response = _context.Groups.Update(Group).Entity;
                _context.SaveChanges();
                return Handler.HandlePutResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupid, Group);
            }
        }

        // DELETE
        [HttpDelete("{Groupid}")]
        public IActionResult Delete(int Groupid)
        {
            try
            {
                Validation.GroupShouldExist(Groupid);

                var Response = _context.Groups.Remove(_context.Groups.Find(Groupid)).Entity;
                _context.SaveChanges();
                return Handler.HandleDeleteResponse(Response);
            }
            catch (Exception ex)
            {
                return Handler.HandleException(ex, Groupid);
            }
        }
    }
}
