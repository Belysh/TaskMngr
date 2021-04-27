using AutoMapper;
using AutoMapper.QueryableExtensions;
using BusinessLogic.Responses;
using BusinessLogic.ViewModels;
using DataAccess.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Services
{
    public class TaskService
    {
        private ITaskRepository _taskRepository { set; get; }
        IMapper mapper;
        public UserService UserService { set; get; }

        public TaskService(ITaskRepository taskRepository, UserService UserService)
        {
            this._taskRepository = taskRepository;
            this.UserService = UserService;
            this.mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DataAccess.Models.Task, ViewModels.Task>();
                cfg.CreateMap<ViewModels.Task, DataAccess.Models.Task>();
                cfg.CreateMap< DataAccess.Models.User , ViewModels.User>();
                cfg.CreateMap<ViewModels.User, DataAccess.Models.User>();
                cfg.CreateMap<DataAccess.Models.Comment, ViewModels.Comment>();
                cfg.CreateMap< ViewModels.Comment, DataAccess.Models.Comment>();
            }).CreateMapper();
        }

        public async Task<Response<ViewModels.Task>> CreateAsync(ViewModels.Task task)
        {
            try
            {
                task.Date = DateTime.Now;
                DataAccess.Models.Task t = mapper.Map<ViewModels.Task, DataAccess.Models.Task>(task);
                ViewModels.Task newTask = mapper.Map<DataAccess.Models.Task, ViewModels.Task>(await _taskRepository.CreateAsync(t));
                return new Response<ViewModels.Task>(newTask);
            }
            catch (Exception e)
            {
                string errorMessage = "An error occured while creating new task";
                return new Response<ViewModels.Task>(errorMessage);
            }
        }
        public async Task<IReadOnlyCollection<ViewModels.Task>> FindByConditionAsync(Expression<Func<DataAccess.Models.Task, bool>> predicat)
        {
            return await mapper.Map<Task<IReadOnlyCollection<DataAccess.Models.Task>>, Task<IReadOnlyCollection<ViewModels.Task>>>((Task<IReadOnlyCollection<DataAccess.Models.Task>>)await _taskRepository.FindByConditionAsync(predicat));
        }
        public async Task<IReadOnlyCollection<ViewModels.Task>> GetAllAsync()
        {
            var taskCollections = mapper.Map<IReadOnlyCollection<DataAccess.Models.Task>, IReadOnlyCollection<ViewModels.Task>>(await _taskRepository.FindAllTasksAllIncludedAsync());            
            foreach(BusinessLogic.ViewModels.Task task in taskCollections)
            {
                task.Manager = (await UserService.GetAllUsersAsync()).FirstOrDefault(x => x.Id == task.ManagerId);
                task.Executor = (await UserService.GetAllUsersAsync()).FirstOrDefault(x => x.Id == task.ExecutorId);
            }
            return taskCollections;
        }

        public async System.Threading.Tasks.Task Delete(int id)
        {
            await _taskRepository.Delete(id);
        }
        public async System.Threading.Tasks.Task Update(ViewModels.Task task)
        {

            await _taskRepository.Update(mapper.Map<ViewModels.Task, DataAccess.Models.Task>(task));

        }

        public async Task<ViewModels.Task> GetByIdAsync(int id)
        {
            return mapper.Map<ViewModels.Task>(await _taskRepository.GetByIdAsync(id));
        }

        public async Task<string> ExportUserTasksToCsv(SecureUser user)
        {
            IEnumerable<ViewModels.Task> tasks = (await GetAllAsync()).Where(
                task => user.Role == UserRole.Executor ? task.Executor.Id == user.Id : task.Manager.Id == user.Id);

            StringBuilder builder = new StringBuilder();

            string[] columnNames = new string[]
            {
                "Name", "Manager",  "Executor", "Deadline", "Description"
            };

            builder.AppendJoin(",", columnNames);
            builder.AppendLine();

            foreach (ViewModels.Task task in tasks)
            {
                string[] taskData = QuoteTaskData(task);
                builder.AppendJoin(",", taskData);
                builder.AppendLine();
            }

            return builder.ToString();
        }

        private string[] QuoteTaskData(ViewModels.Task task)
        {
            return new[]
            {
                TaskPropertyNeedsQuotation(task.Name) ? "\"" + task.Name.Replace("\"", "\"\"") + "\"" : task.Name,
                TaskPropertyNeedsQuotation(task.Manager.Name) ? "\"" + task.Manager.Name.Replace("\"", "\"\"") + "\"" : task.Manager.Name,
                TaskPropertyNeedsQuotation(task.Executor.Name) ? "\"" + task.Executor.Name.Replace("\"", "\"\"") + "\"" : task.Executor.Name,
                task.Date.ToString(),
                TaskPropertyNeedsQuotation(task.Description) ? "\"" + task.Description.Replace("\"", "\"\"") + "\"" : task.Description,
            };
        }

        private bool TaskPropertyNeedsQuotation(string taskProperty)
        {
            return taskProperty.Contains(",") || taskProperty.Contains("\"") ||
                taskProperty.Contains("\r") || taskProperty.Contains("\n");
        }
    }
}