using System.ComponentModel.DataAnnotations;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    public class Tutor
    {
        [Key]
        public int UserId { get; set; }
        public double Rating { get; set; } = 0.0;
        public int TotalReviews { get; set; } = 0;
        public bool IsVerified { get; set; } = false;
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
        public string? VerificationNote { get; set; }
        public decimal HourlyRate { get; set; } = 0.0m;

        public User User { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Class> Classes { get; set; }
    }
}
