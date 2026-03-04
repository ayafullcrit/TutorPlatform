using Microsoft.AspNetCore.Identity;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Responses.Auth
{
    public class UserInfo
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Avatar { get; set; }
        public decimal Balance { get; set; }
        public UserRole Role { get; set; }
        public bool IsEmailVerified { get; set; }

        // Student-specific
        // Tutor-specific
        public bool? IsTutorVerified { get; set; }
    }
    public class AuthResponse
    {
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public UserInfo User {get; set; }
    }
}