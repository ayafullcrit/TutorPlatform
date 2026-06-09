using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Booking
{
    /// <summary>
    /// Request đăng ký lớp học (enrollment) – không cần chọn ngày giờ, không trừ tiền.
    /// </summary>
    public class EnrollClassRequest
    {
        [Required(ErrorMessage = "ClassId là bắt buộc")]
        public int ClassId { get; set; }

        [StringLength(500, ErrorMessage = "Ghi chú không được quá 500 ký tự")]
        public string Note { get; set; } = string.Empty;
    }
}
