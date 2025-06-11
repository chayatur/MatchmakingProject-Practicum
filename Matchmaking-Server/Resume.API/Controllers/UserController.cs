using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Resume.Core.DTOs;
using Resume.Core.IServices;
using Resume.Core.Models;
using Resume.Data;


namespace Resume.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ResumeContext _context;

        public UserController(IUserService userService, IMapper mapper,ResumeContext context)
        {
            _userService = userService;
            _mapper = mapper;
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetByIdUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDTO>> UpdateUser(int id, UserDTO userDto)
        {
            try
            {
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                {
                    return NotFound();
                }

                // עדכן רק את השדות מה-DTO - PasswordHash נשאר ללא שינוי!
                existingUser.Username = userDto.Username;
                existingUser.Email = userDto.Email;
                existingUser.Address = userDto.Address;
                existingUser.Phone = userDto.Phone;
                existingUser.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // החזר UserDTO בלבד (בלי PasswordHash)
                var resultDto = new UserDTO
                {
                    ID = existingUser.ID,
                    Username = existingUser.Username,
                    Email = existingUser.Email,
                    Address = existingUser.Address,
                    Phone = existingUser.Phone
                };

                return Ok(resultDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUser(id);
            return NoContent();
        }
    }
}
