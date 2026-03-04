using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.Entities
{
    public class Tutor
    {
        [Key]
        public int UserId { get; set; }
        public double Rating { get; set; }

        public int TotalReviews { get; set; }
        public bool IsVerified { get; set; }
        public decimal HourlyRate { get; set; }

        public User User { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Class> Classes { get; set; }
    }
}
