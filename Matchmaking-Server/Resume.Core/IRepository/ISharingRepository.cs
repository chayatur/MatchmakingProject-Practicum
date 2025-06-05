using Resume.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Resume.Core.IRepository
{
    public interface ISharingRepository
    {
        Task<Sharing> GetSharingByIdAsync(int id);
        Task<List<Sharing>> GetAllSharingAsync();
        Task<Sharing> AddSharingAsync(Sharing entity);
        Task<Sharing> UpdateSharingAsync(Sharing entity);
        Task<bool> DeleteSharingAsync(int id);
        Task<IEnumerable<Sharing>> GetSharedWithUserAsync(int userId);
        Task<IEnumerable<Sharing>> GetSharedByUserAsync(int userId); // הוספת המתודה
    }
}
