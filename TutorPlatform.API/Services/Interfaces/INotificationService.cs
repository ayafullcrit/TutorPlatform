using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Notification;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task<ApiResponse<NotificationSummary>> GetNotificationsAsync(int userId, int limit = 20);
        Task<ApiResponse> MarkAsReadAsync(int userId, int notificationId);
        Task<ApiResponse> MarkAllAsReadAsync(int userId);
        Task<ApiResponse> DeleteNotificationAsync(int userId, int notificationId);
        Task CreateAsync(int userId, string title, string message,
            string type, string? relatedData = null);
    }
}
