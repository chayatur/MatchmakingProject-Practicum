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

        public async Task<Sharing> GetSharingByIdAsync(int id)
        {
            return await _context.Sharings.Include(s => s.Resumefile).Include(s => s.SharedWithUser).FirstOrDefaultAsync(s => s.ShareID == id);
        }

        public async Task<List<Sharing>> GetAllSharingAsync()
        {
            return await _context.Sharings.Include(s => s.Resumefile).Include(s => s.SharedWithUser).ToListAsync();
        }

        public async Task<Sharing> AddSharingAsync(Sharing entity)
        {
            await _context.Sharings.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Sharing> UpdateSharingAsync(Sharing entity)
        {
            _context.Sharings.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteSharingAsync(int id)
        {
            var sharing = await GetSharingByIdAsync(id);
            if (sharing != null)
            {
                _context.Sharings.Remove(sharing);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Sharing>> GetSharedWithUserAsync(int userId)
        {
            return await _context.Sharings
                .Where(s => s.SharedWithUserID == userId)
                .Include(s => s.Resumefile)
                .Include(s => s.SharedWithUser)
                .ToListAsync();
        }

        public async Task<IEnumerable<Sharing>> GetSharedByUserAsync(int userId)
        {
            return await _context.Sharings
                .Where(s => s.SharedWithUserID == userId)
                .Include(s => s.Resumefile)
                .Include(s => s.SharedWithUser)
                .ToListAsync();
        }
    }
}
