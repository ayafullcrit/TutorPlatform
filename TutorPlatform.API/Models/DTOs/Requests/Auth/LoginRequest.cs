using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email là bắt buộc!")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ!")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Không được để trống mật khẩu!")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 kí tự!")]
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}
