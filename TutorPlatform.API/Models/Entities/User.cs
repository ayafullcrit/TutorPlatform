using System.Runtime.CompilerServices;
using System.ComponentModel.DataAnnotations.Schema;
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
        public decimal Balance { get; set; }

        public UserRole Role { get; set; }
        public bool IsActive { get; set; } = true;
        [NotMapped]
        public bool IsActivated
        {
            get => IsActive;
            set => IsActive = value;
        }
        public Tutor Tutor { get; set; }
        public Student Student { get; set; }
    }
}
