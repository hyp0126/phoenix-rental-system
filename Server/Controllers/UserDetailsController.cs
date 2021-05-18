﻿using AutoMapper;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserDetailsController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly IFileStorageService fileStorageService;
        private readonly UserBiz UB;

        public UserDetailsController(PhoenixContext _context, IMapper _mapper, IFileStorageService fileStorageService)
        {
            this.context = _context;
            this.fileStorageService = fileStorageService;
            this.mapper = _mapper;
            UB = new UserBiz(context);
        }

        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<UserPkgDTO>> GetUser(string id)
        {
            
            UserPkgDTO userPkg = new UserPkgDTO()
            {
                Account = mapper.Map<UserAccountDTO>(await UB.GetUserAccount(id)),
                Details = mapper.Map<UserDetailsDTO>(await UB.GetUserDetails(id)),
                Address = mapper.Map<AddressDTO>(await UB.GetDefaultAddress(id)),
                Role = await GetUserRole(id)
            };

            return userPkg; 
        }

        [HttpPost("InsertUser")]
        public async Task<ActionResult<UserPkgDTO>> InsertUser([FromBody] UserPkgDTO dto)
        {
            var userDetails = mapper.Map<UserDetails>(dto.Details);
            var userAddresses = mapper.Map<Address>(dto.Address);

            UserPkgDTO pDto = new UserPkgDTO()
            {
                Details = mapper.Map<UserDetailsDTO>(await UB.InsertUserDetails(userDetails)),
                Address = mapper.Map<AddressDTO>(await UB.InsertAddress(userAddresses))
            };

            return pDto;
        }
                
        [HttpPut("UpdateUser")]
        public async Task<ActionResult<UserPkgDTO>> UpdateUser([FromBody] UserPkgDTO dto)
        {
            var userDetails = mapper.Map<UserDetails>(dto.Details);
            var userAddresses = mapper.Map<Address>(dto.Address);
           
            UserPkgDTO pDto = new UserPkgDTO()
            {
                Details = mapper.Map<UserDetailsDTO>(await UB.UpdateUserDetails(userDetails)),
                Address = mapper.Map<AddressDTO>(await UB.UpdateAddress(userAddresses))
            };

            return pDto;
        }

        [HttpGet("GetAddresses/{id}")]
        public async Task<ActionResult<List<AddressDTO>>> GetAddresses(string id)
        {
            return mapper.Map<List<AddressDTO>>(await UB.GetAddresses(id));
        }

        [HttpPost("SaveAvatar")]
        public async Task<IActionResult> SaveAvatar()
        {
            var userId = Request.Form.ToArray()[0].Value;
            var userAvatarFile = UB.GetUserAvatar(userId);

            if (!string.IsNullOrEmpty(userAvatarFile))
                await fileStorageService.DeleteFile(userAvatarFile);

            try
            {
                var fileValidate = fileStorageService.CheckFile(Request.Form.Files[0]);
                if (string.IsNullOrEmpty(fileValidate))
                {
                    var filePath = await fileStorageService.SaveFile(Request.Form.Files[0]);
                    return Ok(new { filePath });
                }
                else
                {
                    return BadRequest(fileValidate);
                }
            }
            catch (ArgumentOutOfRangeException)
            {
                return BadRequest("Err:File not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        private async Task<RoleDTO> GetUserRole(string id)
        {
            var role = await context.AspNetRoles.FirstOrDefaultAsync(c => c.Id == id);
            if (role == null) return new RoleDTO() { Name = ""};
            else return new RoleDTO() { Name = role.Name };
        }
    }
}    
