﻿using Microsoft.AspNetCore.Http;
using Resume.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.IServices
{
    public interface IAIService
    {
        Task<AIResponse> GetAIResponseById(int aiId);
        Task AddAiResponseAsync(IFormFile resumeFile, int userId);
        Task<IEnumerable<AIResponse>> GetAllAIResponsesAsync();
        Task<IEnumerable<AIResponse>> GetFilesByUserIdAsync(int userId);
        Task UpdateAIResponseAsync(int id, AIResponse aiResponse);
        Task DeleteAIResponseAsync(int id);

        Task DeleteAllAIResponsesAsync();
        //Task DeleteAIResponseAsync(int id);
    }
}
