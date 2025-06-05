using Microsoft.EntityFrameworkCore;
using Resume.Core.IRepository;
using Resume.Data;
using Resume.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Resume.Core.DTOs;

public class AIRepository : IAIRepository
{
    private readonly ResumeContext _context;

    public AIRepository(ResumeContext context)
    {
        _context = context;
    }

    public async Task<AIResponse> GetAIResponseByIdAsync(int id)
    {
        var response = await _context.AIResponses
            .Include(r => r.User) // להבטיח שהמשתמש יטען יחד עם התשובה
            .FirstOrDefaultAsync(r => r.Id == id);

        return response != null ? response : null;
    }

    public async Task AddAiResponseAsync(AIResponse aiResponse, int userId, string fileName)
    {
        aiResponse.UserId = userId;
        aiResponse.FileName = fileName;
        aiResponse.CreatedAt = DateTime.Now;
        await _context.AIResponses.AddAsync(aiResponse);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<AIResponse>> GetAllAIResponsesAsync()
    {
        return await _context.AIResponses
            .Where(r => r.User != null)
            .Include(r => r.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<AIResponse>> GetFilesByUserIdAsync(int userId)
    {
        return await _context.AIResponses
            .Where(r => r.UserId == userId)
            .ToListAsync();
    }
    public async Task UpdateAIResponseAsync(int id, AIResponse entity)
    {
        _context.AIResponses.Update(entity);
        await _context.SaveChangesAsync();
    }


    public async Task DeleteAllAIResponsesAsync()
    {
        var invalidResponses = await GetAllAIResponsesAsync();

        if (invalidResponses.Any())
        {
            _context.AIResponses.RemoveRange(invalidResponses);
            await _context.SaveChangesAsync();
        }
    }
}
