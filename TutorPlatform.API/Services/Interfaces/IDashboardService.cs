using System.Collections.Generic;
using System.Threading.Tasks;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Dashboard;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<ApiResponse<AdminDashboardStats>> GetAdminStatsAsync();
        Task<ApiResponse<TutorDashboardStats>> GetTutorStatsAsync(int userId);
        Task<ApiResponse<TutorEarningsResponse>> GetTutorEarningsAsync(int userId);
        Task<ApiResponse<StudentDashboardStats>> GetStudentStatsAsync(int userId);
        Task<ApiResponse<List<TutorEarningsChartItem>>> GetTutorEarningsChartAsync(int userId, int months);
        Task<ApiResponse<AdminDashboardStats>> GetPublicStatsAsync();
    }
}
