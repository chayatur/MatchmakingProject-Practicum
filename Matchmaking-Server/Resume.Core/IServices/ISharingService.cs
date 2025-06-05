using Resume.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.IServices
{
    public interface ISharingService
    {
        Task<Sharing> ShareResumeAsync(int resumeFileId, int sharedByUserId, int sharedWithUserId);
        Task<IEnumerable<Sharing>> GetSharedWithUserAsync(int userId);
        Task<IEnumerable<Sharing>> GetSharedByUserAsync(int userId);
        Task<bool> RemoveShareAsync(int sharingId);
    }
}
