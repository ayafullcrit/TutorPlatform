using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Responses.Booking
{
    public class ClassEnrollmentResponse
    {
        public int EnrollmentId { get; set; }
        public int ClassId { get; set; }
        public string ClassTitle { get; set; } = "";
        public string SubjectName { get; set; } = "";
        public int Grade { get; set; }

        public int TutorUserId { get; set; }
        public string TutorName { get; set; } = "";
        public string TutorAvatar { get; set; } = "";
        public string Ward { get; set; } = "";
        public double TutorRating { get; set; }

        public int StudentUserId { get; set; }
        public string StudentName { get; set; } = "";
        public string StudentAvatar { get; set; } = "";
        public string StudentSchool { get; set; } = "";
        public int StudentGradeLevel { get; set; }

        public decimal PricePerSession { get; set; }
        public int DurationMinutes { get; set; }
        public int SessionsPerWeek { get; set; }

        public DateTime EnrolledAt { get; set; }
        public EnrollmentStatus Status { get; set; }

        /// <summary>Buổi học gần nhất (pending/confirmed) – null nếu chưa đặt</summary>
        public string? NextSessionTime { get; set; }

        /// <summary>Số buổi học đã đặt tuần này</summary>
        public int SessionsBookedThisWeek { get; set; }
    }
}
