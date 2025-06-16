using Microsoft.AspNetCore.Mvc;
using Resume.Core.Models;
using System.Net.Http;
using System.Text.Json;

namespace Resume.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GPTController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _myApiKey;

        public GPTController(IConfiguration configuration, HttpClient httpClient)
        {
            _myApiKey = configuration["OpenAI:ApiKey"];
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GptRequest gptRequest)
        {
            try
            {
                var prompt = new
                {
                    model = "gpt-4o-mini",
                    messages = new[] {
                        new { role = "system", content = gptRequest.Prompt },
                        new { role = "user", content = gptRequest.Question }
                    }
                };

                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
                {
                    Content = JsonContent.Create(prompt)
                };

                request.Headers.Add("Authorization", $"Bearer {_myApiKey}");

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, responseContent);
                }

                var responseContent1 = await response.Content.ReadAsStringAsync();
                return Ok(responseContent1);
            }
            catch (HttpRequestException httpEx)
            {
                Console.WriteLine($"שגיאה בחיבור ל-API: {httpEx.Message}");
                return StatusCode(500, "בעיה בחיבור ל-API.");
            }
            catch (System.Text.Json.JsonException jsonEx)
            {
                Console.WriteLine($"שגיאה בקריאת התשובה מ-API: {jsonEx.Message}");
                return StatusCode(500, "שגיאה בקריאת התשובה מ-API.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"שגיאה כללית: {ex.Message}");
                return StatusCode(500, "שגיאה כלשהי במהלך הפעולה.");
            }
        }
    }
}
