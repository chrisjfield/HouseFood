using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace HouseFoodAPI.Helpers
{
    public class ApiHelper : Controller
    {
        public IActionResult HandleGetResponse<T>(T Values)
        {
            if (Values == null)
            {
                return NotFound("Requested item not found");
            }
            return Ok(Values);
        }

        public IActionResult HandlePostResponse<T>(T Values)
        {
            if (Values == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error has occured. Please contact a system admin");
            }
            return Created("Ingredients", Values);
        }

        public IActionResult HandlePutResponse<T>(T Values)
        {
            if (Values == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error has occured. Please contact a system admin");
            }
            return Ok(Values);
        }

        public IActionResult HandleBulkCheckResponse(int rowsAffected)
        {
            if (rowsAffected <= 0)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error has occured. Please contact a system admin");
            }
            return Ok(rowsAffected);
        }

        public IActionResult HandleDeleteResponse<T>(T Values)
        {
            if (Values == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error has occured. Please contact a system admin");
            }
            return NoContent();
        }

        public IActionResult HandleException(Exception Ex) =>
            StatusCode(StatusCodes.Status500InternalServerError, Ex.Message);

        public IActionResult HandleException<T>(Exception Ex, T RequestParameter) =>
            // use this to log the request parameter and body as well as the error
            StatusCode(StatusCodes.Status500InternalServerError, Ex.Message);

        public IActionResult HandleException<T, R>(Exception Ex, T RequestParameter, R RequestBody) =>
            // use this to log the request parameter and body as well as the error
            StatusCode(StatusCodes.Status500InternalServerError, Ex.Message);
    }
}
