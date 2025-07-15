using Microsoft.EntityFrameworkCore;
using Resume.Core.IRepository;
using Resume.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Resume.Data.Repositories
{
    public class SharingRepository : ISharingRepository
    {
        private readonly ResumeContext _context;

        public SharingRepository(ResumeContext context)
        {
            _context = context;
        }

        public async Task<bool> IsAlreadySharedAsync(int resumeFileId, int sharedWithUserId)
        {
            return await _context.Sharings.AnyAsync(s =>
                s.ResumefileID == resumeFileId &&
                s.SharedWithUserID == sharedWithUserId);
        }

        public async Task AddSharingAsync(Sharing sharing)
        {
            await _context.Sharings.AddAsync(sharing);
            await _context.SaveChangesAsync();
        }

        public async Task<AIResponse> GetResumeFileByIdAsync(int fileId)
        {
            return await _context.AIResponses.FindAsync(fileId);
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<string> ShareFileWithAllAsync(int sharedByUserId, int resumeFileId)
        {
            var file = await _context.AIResponses.FindAsync(resumeFileId);
            if (file == null) return "Resume file not found.";

            var allUsers = await _context.Users.ToListAsync();

            foreach (var user in allUsers)
            {
                if (user.ID == sharedByUserId) continue;

                bool alreadyShared = await _context.Sharings.AnyAsync(s =>
                    s.ResumefileID == resumeFileId && s.SharedWithUserID == user.ID);

                if (!alreadyShared)
                {
                    _context.Sharings.Add(new Sharing
                    {
                        ResumefileID = resumeFileId,
                        SharedByUserID = sharedByUserId,
                        SharedWithUserID = user.ID,
                        SharedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return "שיתוף עם כל המשתמשים בוצע בהצלחה.";
        }

        public async Task<IEnumerable<Sharing>> GetAllSharingsAsync()
        {
            return await _context.Sharings
                .Include(s => s.Resumefile)
                .Include(s => s.SharedWithUser)
                .Include(s => s.SharedByUser)
                .ToListAsync();
        }

        public async Task<IEnumerable<Sharing>> GetAllSharingsByIdAsync(int userId)
        {
            return await _context.Sharings
                .Where(s => s.SharedWithUserID == userId)
                .Include(s => s.Resumefile)
                .Include(s => s.SharedByUser)
                .ToListAsync();
        }

        public async Task DeleteAllSharingAsync()
        {
            var allSharings = await _context.Sharings.ToListAsync();
            _context.Sharings.RemoveRange(allSharings);
            await _context.SaveChangesAsync();
        }
    }
}
