using AutoMapper;
using BusinessLogic.Responses;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : Controller
    {
        private TaskService _taskService { get; set; }
        private UserService _userService { get; set; }

        public TaskController(TaskService taskService, UserService userService)
        {
            _taskService = taskService;
            _userService = userService;
        }            


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var currentUser = (await _userService.GetAllUsersAsync()).FirstOrDefault(user => user.Login == User.Identity.Name);
            IEnumerable<BusinessLogic.ViewModels.Task> tasks = null;
            if (currentUser.Role == BusinessLogic.ViewModels.UserRole.Executor)
                tasks = (await _taskService.GetAllAsync()).Where(x => x.ExecutorId == currentUser.Id);
            if (currentUser.Role == BusinessLogic.ViewModels.UserRole.Manager)
                tasks = (await _taskService.GetAllAsync()).Where(x => x.ManagerId == currentUser.Id);
            
            HttpContext.Response.Cookies.Append("user_id", currentUser.Id.ToString());
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            BusinessLogic.ViewModels.Task task = await _taskService.GetByIdAsync(id);
            return Ok(task);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(BusinessLogic.ViewModels.Task task)
        {
            if (task == null)
            {
                return BadRequest();
            }

            await _taskService.CreateAsync(task);

            return Ok();
        }

        
        [HttpDelete]
        [Authorize]
        public async Task Delete(int id)
        {
            await _taskService.Delete(id);
        }
        [HttpPut]
        [Authorize]
        public async Task Update(BusinessLogic.ViewModels.Task task)
        {
            await _taskService.Update(task);
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("/api/tasks/export")]
        [Authorize(Roles = "Manager, Executor")]
        [HttpGet]
        public async Task<IActionResult> Export()
        {
            BusinessLogic.ViewModels.SecureUser currentUser = (await _userService.GetAllSecureUsersAsync()).
                FirstOrDefault(user => user.Login == User.Identity.Name);

            string data = await _taskService.ExportUserTasksToCsv(currentUser);

            MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(data));
            FileStreamResult result = new FileStreamResult(stream, "text/plain");
            result.FileDownloadName = "export_" + DateTime.Now + ".csv";

            return result;
        }
    }
}
