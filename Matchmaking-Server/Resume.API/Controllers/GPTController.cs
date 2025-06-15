﻿using Microsoft.AspNetCore.Mvc;
using Resume.Core.Models;
using System.Net.Http;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Resume.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private static readonly HttpClient client = new HttpClient();
        private readonly string myApiKey;

        public ChatController(IConfiguration configuration)
        {
            myApiKey = configuration["OpenAI:ApiKey"];
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

                request.Headers.Add("Authorization", $"Bearer {myApiKey}");

                // שליחת הבקשה ל-API
                var response = await client.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, responseContent);
                }

                var responseContent1 = await response.Content.ReadAsStringAsync();
                return Ok(responseContent1); // החזרת התוכן כהצלחה
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
