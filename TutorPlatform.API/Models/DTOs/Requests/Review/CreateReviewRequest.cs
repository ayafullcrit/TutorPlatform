using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Review
{
    public class CreateReviewRequest
    {
        [Required(ErrorMessage = "TutorId là bắt buộc")]
        public int TutorId { get; set; }

        [Required(ErrorMessage = "BookingId là bắt buộc")]
        public int BookingId { get; set; }

        [Required(ErrorMessage = "Rating là bắt buộc")]
        [Range(1, 5, ErrorMessage = "Rating phải từ 1 đến 5")]
        public int Rating { get; set; }

        [StringLength(1000, ErrorMessage = "Nhận xét không được quá 1000 ký tự")]
        public string Comment { get; set; } = string.Empty;
    }
}
