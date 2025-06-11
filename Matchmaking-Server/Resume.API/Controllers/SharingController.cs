using Microsoft.AspNetCore.Mvc;
using Resume.Core.Models;
using Resume.Core.IServices;
using System.Threading.Tasks;
using Resume.Core.DTOs;

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
        public async Task<IActionResult> ShareFile([FromBody] SharingDTO model)
        {
            var result = await _sharingService.ShareResumeAsync(model.ResumefileID, model.SharedByUserID, model.SharedWithUserID);

            if (result == null)
            {
                return BadRequest("Failed to share the resume.");
            }

            return Ok(result);
        }

        [HttpGet("user/{userId}")]
       


        [HttpDelete("{sharingId}")]
        public async Task<IActionResult> RemoveShare(int sharingId)
        {
            var success = await _sharingService.RemoveShareAsync(sharingId);
            if (!success)
            {
                return NotFound("Sharing not found.");
            }

            return NoContent();
        }
    }
}
