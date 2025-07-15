using Microsoft.AspNetCore.Mvc;
using Resume.Core.DTOs;
using Resume.Core.IServices;

namespace Resume.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharingController : ControllerBase
    {
        private readonly ISharingService _sharingService;

        public SharingController(ISharingService sharingService)
        {
            _sharingService = sharingService;
        }

        [HttpPost]
        public async Task<IActionResult> ShareFile([FromBody] SharingDTO request)
        {
            if (request.ShareAll)
            {
                var result = await _sharingService.ShareFileWithAllAsync(request.UserId, request.ResumeFileId);
                if (result == "Resume file not found.")
                    return NotFound(result);

                return Ok(new { message = result });
            }

            if (request.SharedWithUserId.HasValue)
            {
                var result = await _sharingService.ShareFileAsync(request.ResumeFileId, request.UserId, request.SharedWithUserId.Value);

                if (result == "Resume file not found.")
                    return NotFound(result);

                if (result == "כבר שותף עם המשתמש הזה.")
                    return BadRequest(result);

                return Ok(new { message = result });
            }

            return BadRequest("בקשת שיתוף לא חוקית.");
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllSharings()
        {
            var sharings = await _sharingService.GetAllSharingsAsync();
            return Ok(sharings);
        }

        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetSharingsByUser(int userId)
        {
            var sharings = await _sharingService.GetAllSharingsByIdAsync(userId);
            return Ok(sharings);
        }

        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllSharings()
        {
            await _sharingService.DeleteAllSharingAsync();
            return NoContent();
        }
    }
}
