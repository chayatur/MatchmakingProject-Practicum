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
        private readonly ISharingRepository _repository;

        public SharingService(ISharingRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> ShareFileAsync(int resumeFileId, int sharedByUserId, int sharedWithUserId)
        {
            var file = await _repository.GetResumeFileByIdAsync(resumeFileId);
            if (file == null)
                return "Resume file not found.";

            if (await _repository.IsAlreadySharedAsync(resumeFileId, sharedWithUserId))
                return "כבר שותף עם המשתמש הזה.";

            var sharing = new Sharing
            {
                ResumefileID = resumeFileId,
                SharedWithUserID = sharedWithUserId,
                SharedByUserID = sharedByUserId,
                SharedAt = DateTime.UtcNow
            };

            await _repository.AddSharingAsync(sharing);
            return "שיתוף בוצע בהצלחה.";
        }

        public async Task<string> ShareFileWithAllAsync(int sharedByUserId, int resumeFileId)
        {
            return await _repository.ShareFileWithAllAsync(sharedByUserId, resumeFileId);
        }

        public async Task<IEnumerable<Sharing>> GetAllSharingsAsync()
        {
            return await _repository.GetAllSharingsAsync();
        }

        public async Task<IEnumerable<Sharing>> GetAllSharingsByIdAsync(int userId)
        {
            return await _repository.GetAllSharingsByIdAsync(userId);
        }

        public async Task DeleteAllSharingAsync()
        {
            await _repository.DeleteAllSharingAsync();
        }
    }
}
