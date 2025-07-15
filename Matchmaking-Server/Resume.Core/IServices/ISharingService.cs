using Resume.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.IServices
{
    public interface ISharingService
    {
        Task<string> ShareFileAsync(int resumeFileId, int sharedByUserId, int sharedWithUserId);
        Task<string> ShareFileWithAllAsync(int sharedByUserId, int resumeFileId);
        Task<IEnumerable<Sharing>> GetAllSharingsAsync();
        Task<IEnumerable<Sharing>> GetAllSharingsByIdAsync(int userId);
        Task DeleteAllSharingAsync();
    }
}
