using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.Entities
{
    public class Student
    {
        [Key]
        public int UserId { get; set; }
        public string Address { get; set; } = string.Empty;
        [Range(1,12)]
        public int GradeLevel { get; set; }
        public bool IsActive { get; set; }

        public User User { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }

        public ICollection<Class> EnrolledClasses { get; set; }
    }
}