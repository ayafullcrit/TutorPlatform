using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Notification;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<NotificationSummary>> GetNotificationsAsync(
            int userId, int limit = 20)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId)
                    .OrderByDescending(n => n.CreatedAt)
                    .Take(limit)
                    .ToListAsync();

                var unread = await _context.Notifications
                    .CountAsync(n => n.UserId == userId && !n.IsRead);

                var summary = new NotificationSummary
                {
                    UnreadCount = unread,
                    Notifications = notifications.Select(MapToResponse).ToList()
                };

                return new ApiResponse<NotificationSummary>(summary, "OK");
            }
            catch (Exception ex)
            {
                return new ApiResponse<NotificationSummary>(
                    "Lỗi lấy thông báo", new List<string> { ex.Message });
            }
        }

        // ============================================
        // ĐÁNH DẤU ĐÃ ĐỌC — 1 CÁI
        // ============================================
        public async Task<ApiResponse> MarkAsReadAsync(int userId, int notificationId)
        {
            try
            {
                var n = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

                if (n == null)
                    return new ApiResponse("Thông báo không tồn tại", false);

                n.IsRead = true;
                await _context.SaveChangesAsync();
                return new ApiResponse("OK", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse(ex.Message, false);
            }
        }

        // ============================================
        // ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
        // ============================================
        public async Task<ApiResponse> MarkAllAsReadAsync(int userId)
        {
            try
            {
                await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead)
                    .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));

                return new ApiResponse("Đã đánh dấu tất cả là đã đọc", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse(ex.Message, false);
            }
        }

        // ============================================
        // XOÁ THÔNG BÁO
        // ============================================
        public async Task<ApiResponse> DeleteNotificationAsync(int userId, int notificationId)
        {
            try
            {
                var n = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

                if (n == null)
                    return new ApiResponse("Thông báo không tồn tại", false);

                _context.Notifications.Remove(n);
                await _context.SaveChangesAsync();
                return new ApiResponse("Đã xoá", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse(ex.Message, false);
            }
        }

        // ============================================
        // TẠO THÔNG BÁO NỘI BỘ (dùng bởi BookingService)
        // ============================================
        public async Task CreateAsync(int userId, string title, string message,
            string type, string? relatedData = null)
        {
            try
            {
                var notification = new Notification
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = type,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow,
                    RelatedData = relatedData
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Thông báo không được làm crash business logic
            }
        }

        // ============================================
        // HELPER
        // ============================================
        private NotificationResponse MapToResponse(Notification n)
        {
            var icon = n.Type switch
            {
                "Booking" => "📅",
                "Payment" => "💳",
                "Review" => "⭐",
                "System" => "🔔",
                _ => "📩"
            };

            return new NotificationResponse
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                TypeIcon = icon,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                TimeAgo = GetTimeAgo(n.CreatedAt),
                RelatedData = n.RelatedData
            };
        }

        private static string GetTimeAgo(DateTime dt)
        {
            var diff = DateTime.UtcNow - dt;
            if (diff.TotalMinutes < 1) return "vừa xong";
            if (diff.TotalHours < 1) return $"{(int)diff.TotalMinutes} phút trước";
            if (diff.TotalDays < 1) return $"{(int)diff.TotalHours} giờ trước";
            if (diff.TotalDays < 30) return $"{(int)diff.TotalDays} ngày trước";
            return $"{(int)(diff.TotalDays / 30)} tháng trước";
        }
    }
}