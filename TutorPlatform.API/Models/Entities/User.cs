using System.Runtime.CompilerServices;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public double Balance { get; set; }

        public UserRole Role { get; set; }
        public bool IsActivated { get; set; }
        public Tutor Tutor { get; set; }
        public Student Student { get; set; }
    }
}