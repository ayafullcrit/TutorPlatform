using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Auth
{   
    public class ChangePasswordRequest
    {       
        [Required(ErrorMessage = "Mật khẩu hiện tại là bắt buộc")]
        public string CurrentPassword { get; set; }

        [Required(ErrorMessage = "Mật khẩu mới là bắt buộc")]
        [StringLength(100, MinimumLength = 6,
            ErrorMessage = "Mật khẩu mới phải từ 6-100 ký tự")]
        public string NewPassword { get; set; }
              
        [Required(ErrorMessage = "Xác nhận mật khẩu mới là bắt buộc")]
        [Compare("NewPassword", ErrorMessage = "Mật khẩu xác nhận không khớp")]
        public string ConfirmNewPassword { get; set; }
    }
}