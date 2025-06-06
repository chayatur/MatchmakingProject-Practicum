﻿using AutoMapper;

using Resume.Core.IRepository;
using Resume.Core.IServices;
using Resume.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Resume.Service.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository,IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<Core.Models.User> CreateUser(User dto)
        {
            await _userRepository.AddUser(dto);
            return dto;
        }

        public async Task DeleteUser(int id)
        {
            await _userRepository.DeleteUser(id);
        }

        public async Task<IEnumerable<Core.Models.User>> GetAllUsers()
        {
            return await _userRepository.GetAllUsers();
        }

        public async Task<Core.Models.User> GetByIdUser(int id)
        {
            return await _userRepository.GetUserById(id);
        }

        public async Task UpdateUser(int id, User user)
        {
            await _userRepository.UpdateUser(id, user);
        }

       
    }
}
