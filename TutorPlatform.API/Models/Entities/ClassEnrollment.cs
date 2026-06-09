using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    /// <summary>
    /// Học viên đăng ký vào một lớp học (enrollment, không có giờ cụ thể).
    /// Tách biệt với Booking (buổi học cụ thể có StartTime/EndTime).
    /// </summary>
    public class ClassEnrollment
    {
        public int Id { get; set; }

        /// <summary>FK → Student.UserId</summary>
        public int StudentId { get; set; }

        /// <summary>FK → Class.Id</summary>
        public int ClassId { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Active;

        public string Note { get; set; } = string.Empty;

        // Navigation
        public Student Student { get; set; } = null!;
        public Class Class { get; set; } = null!;
    }
}
