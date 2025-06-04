using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Resume.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Download_ShowFilesController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        public Download_ShowFilesController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpGet("download-url")]
        public async Task<IActionResult> GetDownloadUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest("File name is required.");
            }

            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = "filesresume.testpnoren",
                    Key = fileName,
                    Verb = HttpVerb.GET,
                    Expires = DateTime.UtcNow.AddMinutes(5)
                };
                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error accessing S3: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}