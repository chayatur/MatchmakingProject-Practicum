using Resume.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.IRepository
{
    public interface ISharingRepository
    {
        Task<bool> IsAlreadySharedAsync(int resumeFileId, int sharedWithUserId);
        Task AddSharingAsync(Sharing sharing);
        Task<AIResponse> GetResumeFileByIdAsync(int fileId);
        Task<User> GetUserByIdAsync(int userId);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<string> ShareFileWithAllAsync(int sharedByUserId, int resumeFileId);
        Task<IEnumerable<Sharing>> GetAllSharingsAsync();
        Task<IEnumerable<Sharing>> GetAllSharingsByIdAsync(int userId);
        Task DeleteAllSharingAsync();

    }
}
