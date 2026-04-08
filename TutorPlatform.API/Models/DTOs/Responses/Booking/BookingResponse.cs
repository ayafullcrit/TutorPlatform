using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Responses.Booking
{
    public class BookingResponse
    {
        public int Id { get; set; }

        // Student Info
        public int StudentUserId { get; set; }
        public string StudentName { get; set; }
        public string StudentAvatar { get; set; }

        // Tutor Info
        public int TutorUserId { get; set; }
        public string TutorName { get; set; }
        public string TutorAvatar { get; set; }

        // Class Info
        public int ClassId { get; set; }
        public string ClassTitle { get; set; }
        public string SubjectName { get; set; }
        public decimal PricePerSession { get; set; }
        public int DurationMinutes { get; set; }

        // Booking Info
        public DateTime BookingDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Note { get; set; }

        // Status
        public BookingStatus Status { get; set; }
        public string StatusText { get; set; }
        public string StatusColor { get; set; }  // CSS color class
    }
}