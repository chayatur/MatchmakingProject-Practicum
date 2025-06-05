using Microsoft.AspNetCore.Http;
using Resume.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.IRepository
{
    public interface IAIRepository
    {
        Task<AIResponse> GetAIResponseByIdAsync(int id);
        Task AddAiResponseAsync(AIResponse aiResponse, int userId, string fileName);
        Task<IEnumerable<AIResponse>> GetAllAIResponsesAsync();
        Task<IEnumerable<AIResponse>> GetFilesByUserIdAsync(int userId);
        Task UpdateAIResponseAsync(int id, AIResponse aiResponse); // עדכון המתודה עם שני פרמטרים
        Task DeleteAllAIResponsesAsync();
    }
}
