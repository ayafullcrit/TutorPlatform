using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Booking
{
    public class CreateBookingRequest
    {
        [Required(ErrorMessage = "ClassId là bắt buộc")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Ngày đặt lịch là bắt buộc")]
        [FutureDate(ErrorMessage = "Thời gian bắt đầu phải ở trong tương lai")]
        public DateTime StartTime { get; set; }

        [StringLength(500, ErrorMessage = "Ghi chú không được quá 500 ký tự")]
        public string Note { get; set; } = string.Empty;
    }

    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value is not DateTime dateTime)
            {
                return false;
            }

            var now = DateTime.UtcNow;
            var minAllowedTime = now.AddHours(1);

            // Thời gian được chọn phải lớn hơn bây giờ + 1 giờ
            return dateTime > minAllowedTime;
        }
    }
}
