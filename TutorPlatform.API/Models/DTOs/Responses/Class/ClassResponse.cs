using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Responses.Class
{
    public class ClassResponse
    {
        public int Id { get; set; }

        // Tutor Info
        public int TutorUserId { get; set; }
        public string TutorName { get; set; }
        public string TutorAvatar { get; set; }
        public double TutorRating { get; set; }
        public int TutorTotalReviews { get; set; }

        // Subject Info
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public string SubjectIcon { get; set; }

        // Class Info
        public string Title { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public int Grade { get; set; }

        // Pricing & Schedule
        public decimal PricePerSession { get; set; }
        public int DurationMinutes { get; set; }
        public int? TotalSessions { get; set; }

        // Capacity
        public int MaxStudents { get; set; }
        public int CurrentStudents { get; set; }
        public int AvailableSlots { get; set; }

        // Status
        public ClassStatus Status { get; set; }
        public string StatusText { get; set; }
        public bool IsOpenForBooking { get; set; }
        public bool IsFull { get; set; }

        // Metadata
        public int ViewCount { get; set; }
        public int BookingCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}