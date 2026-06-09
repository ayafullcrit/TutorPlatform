using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Booking
{
    /// <summary>
    /// Request đặt một buổi học cụ thể trong lớp đã enroll – có StartTime, trừ tiền.
    /// </summary>
    public class ScheduleSessionRequest
    {
        [Required(ErrorMessage = "ClassId là bắt buộc")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Thời gian bắt đầu là bắt buộc")]
        public DateTime StartTime { get; set; }

        [StringLength(500)]
        public string Note { get; set; } = string.Empty;
    }
}
