using Resume.Core.IRepository;
using Resume.Core.IServices;
using Resume.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.Services
{
    public class SharingService : ISharingService
    {
        private readonly ISharingRepository _sharingRepository;

        public SharingService(ISharingRepository sharingRepository)
        {
            _sharingRepository = sharingRepository;
        }

        public async Task<Sharing> ShareResumeAsync(int resumeFileId, int sharedByUserId, int sharedWithUserId)
        {
            var sharing = new Sharing
            {
                ResumefileID = resumeFileId,
                SharedWithUserID = sharedWithUserId,
                SharedAt = DateTime.UtcNow
            };

            return await _sharingRepository.AddSharingAsync(sharing);
        }

        public async Task<IEnumerable<Sharing>> GetSharedWithUserAsync(int userId)
        {
            return await _sharingRepository.GetSharedWithUserAsync(userId);
        }

        public async Task<IEnumerable<Sharing>> GetSharedByUserAsync(int userId) // הוספת המתודה
        {
            return await _sharingRepository.GetSharedByUserAsync(userId);
        }

        public async Task<bool> RemoveShareAsync(int sharingId)
        {
            return await _sharingRepository.DeleteSharingAsync(sharingId);
        }
    }
}
