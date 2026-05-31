using System.ComponentModel.DataAnnotations;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Requests.User
{
    public class AdminUpdateUserRequest
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        [MaxLength(500)]
        public string? Address { get; set; }
        [MaxLength(500)]
        public string? AvatarUrl { get; set; }
        public UserRole? Role { get; set; }
    }
    public class ToggleUserStatusRequest
    {
        public bool IsActive { get; set; }
    }
}
