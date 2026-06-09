using System.ComponentModel.DataAnnotations.Schema;

namespace TutorPlatform.API.Models.Entities
{
    /// <summary>
    /// Lịch rảnh gia sư tự khai báo theo ngày trong tuần.
    /// Nếu gia sư chưa khai báo, hệ thống tự tính từ 7h–21h trừ slot đã có booking.
    /// </summary>
    public class TutorAvailability
    {
        public int Id { get; set; }

        [ForeignKey("Tutor")]
        public int TutorId { get; set; }

        /// <summary>0=Chủ nhật, 1=Thứ 2, ..., 6=Thứ 7 (DayOfWeek enum)</summary>
        public DayOfWeek DayOfWeek { get; set; }

        /// <summary>Giờ bắt đầu rảnh trong ngày (VD: 08:00)</summary>
        public TimeSpan StartTime { get; set; }

        /// <summary>Giờ kết thúc rảnh trong ngày (VD: 11:00)</summary>
        public TimeSpan EndTime { get; set; }

        // Navigation
        public Tutor Tutor { get; set; } = null!;
    }
}
