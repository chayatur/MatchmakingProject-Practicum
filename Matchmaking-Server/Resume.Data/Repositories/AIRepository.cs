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
        aiResponse.CreatedAt = DateTime.UtcNow;
        await _context.AIResponses.AddAsync(aiResponse);
        Console.WriteLine(aiResponse.Id);
        //var user = await _context.Users
        //    .FirstOrDefaultAsync(u => u.ID == userId);

        //if (user == null)
        //{
        //    throw new Exception("User not found");
        //}

        //user.Files.Add(aiResponse);
        await _context.SaveChangesAsync();
    }
    public async Task<IEnumerable<AIResponse>> GetAllAIResponsesAsync()
    {
        //return await _context.AIResponses.Include(u=>u.User).ToListAsync();
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

    public async Task<IEnumerable<AIResponse>> GetPermittedFilesForUserAsync(int userId)
    {
        var sharedIds = await _context.Sharings
            .Where(s => s.SharedWithUserID == userId)
            .Select(s => s.ResumefileID)
            .ToListAsync();

        return await _context.AIResponses
            .Where(r => r.User != null && (r.UserId == userId || sharedIds.Contains(r.Id)))
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task DeleteAllAIResponsesAsync()
    {
        var invalidResponses = await GetAllAIResponsesAsync();

        //_context.AIResponses.RemoveRange(invalidResponses);
        //await _context.SaveChangesAsync();

        if (invalidResponses.Any())
        {
            _context.AIResponses.RemoveRange(invalidResponses);
            await _context.SaveChangesAsync();
        }


    }

    public async Task DeleteAiResponseById(int aiResponseId)
    {
        var resume = await _context.AIResponses.FirstOrDefaultAsync(r => r.Id == aiResponseId);

        if (resume == null)
            throw new Exception($"AIResponse with ID {aiResponseId} not found.");

        var sharings = await _context.Sharings
            .Where(s => s.ResumefileID == aiResponseId)
            .ToListAsync();

        if (sharings.Any())
            _context.Sharings.RemoveRange(sharings);

        _context.AIResponses.Remove(resume);
        await _context.SaveChangesAsync();
    }

    public async Task<AIResponse> UpdateAIResponseAsync(AIResponse response)
    {
        _context.AIResponses.Update(response);
        await _context.SaveChangesAsync();
        return response;
    }



}
