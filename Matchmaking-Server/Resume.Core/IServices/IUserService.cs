using Resume.Core.DTOs;
using Resume.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Resume.Core.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<Models.User>> GetAllUsers();
        Task<Models.User> GetByIdUser(int id);
        Task<Models.User> CreateUser(Models.User dto);
        Task UpdateUser(int id, Models.User  user);
        Task DeleteUser(int id);
    }
}
