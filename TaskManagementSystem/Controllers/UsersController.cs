using BusinessLogic.Responses;
using BusinessLogic.Services;
using BusinessLogic.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserService userService;
        private readonly TaskService taskService;
        private readonly ILogger<UsersController> logger;

        public UsersController(UserService userService, TaskService taskService, ILogger<UsersController> logger)
        {
            this.userService = userService;
            this.taskService = taskService;
            this.logger = logger;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            try
            {
                IEnumerable<SecureUser> users = await userService.GetAllSecureUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                logger.LogInformation("Failed GET request in UsersContoller. Current user - " + 
                    User.Identity.Name + ". Error details: " + ex);

                return BadRequest("An error occured while loading users data");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                SecureUser user = await userService.GetSecureUserById(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                logger.LogInformation("Failed GET by id request in UsersContoller. Current user - " + 
                    User.Identity.Name + ". Error details: " + ex);

                return BadRequest("An error occured while loading user data");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(User user)
        {
            if (user == null)
            {
                return BadRequest("Empty user data");
            }

            if (user.Password.Length < 6 || user.Password.Length > 30)
            {
                return BadRequest("Password length must be between 6 and 30 characters");
            }

            Response<SecureUser> response = await userService.Create(user);

            if (!response.Success)
            {
                return BadRequest(response.Message);
            }

            return Ok(response.Data);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(User user)
        {
            if (user == null)
            {
                return BadRequest("Request body does not contain user data");
            }
            
            User existingUser = await userService.GetUserById(user.Id);
            IEnumerable<SecureUser> users = await userService.GetAllSecureUsersAsync();

            if (!users.Any(u => u.Id == user.Id))
            {
                return NotFound("User not found");
            }            

            if (user.Login != existingUser.Login)
            {
                if (users.Any(u => u.Login == user.Login))
                {
                    return BadRequest("User with this login already exists");
                }
            }

            if (user.Email != existingUser.Email)
            {
                if (users.Any(u => u.Email == user.Email))
                {
                    return BadRequest("User with this email already exists");
                }
            }

            if (string.IsNullOrWhiteSpace(user.Password))
            {
                user.Password = existingUser.Password;
            }
            else
            {
                if (user.Password.Length < 6 || user.Password.Length > 30)
                {
                    return BadRequest("Password length must be between 6 and 30 characters");
                }

                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            user.RefreshToken = null;

            try
            {
                await userService.Update(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                logger.LogInformation("Failed PUT request in UsersContoller. Current user - " + 
                    User.Identity.Name + ". Error details: " + ex);

                return BadRequest("An error occured while updating user");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            SecureUser user = await userService.GetSecureUserById(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            if ((await taskService.GetAllAsync()).AsEnumerable().Any(t => t.Manager.Id == id || t.Executor.Id == id))
            {
                return BadRequest("You can't delete users with active or completed tasks. Try to deactivate account instead.");
            }

            try
            {
                await userService.Delete(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                logger.LogInformation("Failed PUT request in UsersContoller. Current user - " + 
                    User.Identity.Name + ". Error details: " + ex);

                return BadRequest("An error occured while deleting user");
            }
        }
    }
}