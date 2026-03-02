using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TutorPlatform.API.Models.Entities
{
    public class Notification
    {
        public int Id { get; set; }

        // Người nhận thông báo (User.Id là int)
        public int UserId { get; set; }

        public string Title { get; set; } = string.Empty; // Ví dụ: "Xác nhận lịch học"
        public string Message { get; set; } = string.Empty; // Nội dung chi tiết
        
        // Loại thông báo: "System", "Booking", "Payment", "Chat"
        // Bạn có thể tạo thêm Enum NotificationType nếu muốn chặt chẽ
        public string Type { get; set; } = string.Empty; 

        public bool IsRead { get; set; } = false; // Đã xem chưa
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Dùng để điều hướng khi click vào (VD: Link đến trang chi tiết Booking)
        // Hoặc lưu JSON data tùy biến
        public string? RelatedData { get; set; } 

        // Navigation Property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}