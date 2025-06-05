using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Resume.Core.IServices;
using Resume.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Resume.Core.DTOs;

namespace Resume.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIResponseController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly IMapper _mapper;

        public AIResponseController(IAIService aiService, IMapper mapper)
        {
            _aiService = aiService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAIResponses()
        {
            var responses = await _aiService.GetAllAIResponsesAsync();
            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAIResponseById(int id)
        {
            var response = await _aiService.GetAIResponseById(id);
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> AddAIResponse([FromForm] AIResponseRequestDto request)
        {
            if (request.ResumeFile == null || request.ResumeFile.Length == 0)
            {
                return BadRequest("Resume file is missing.");
            }

            try
            {
                await _aiService.AddAiResponseAsync(request.ResumeFile, request.UserId);
                return Ok("Resume successfully analyzed and saved.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAIResponse(int id, [FromBody] AIResponse aiResponse)
        {
            var existingResponse = await _aiService.GetAIResponseById(id);
            if (existingResponse == null)
            {
                return NotFound();
            }

            try
            {
                await _aiService.UpdateAIResponseAsync(id, aiResponse);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete]
        [Route("all")]
        public async Task<IActionResult> DeleteAllAIResponses()
        {
            await _aiService.DeleteAllAIResponsesAsync();
            return NoContent();
        }
    }
}
