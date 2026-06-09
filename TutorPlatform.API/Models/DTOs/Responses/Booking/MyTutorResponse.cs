namespace TutorPlatform.API.Models.DTOs.Responses.Booking
{
    public class MyTutorResponse
    {
        public int TutorUserId { get; set; }
        public string TutorName { get; set; } = string.Empty;
        public string TutorAvatar { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string ClassTitle { get; set; } = string.Empty;
        public string TeachingSubjects { get; set; } = string.Empty;
        public string Ward { get; set; } = string.Empty;
        public decimal PricePerSession { get; set; }
        public double Rating { get; set; }
        public string? NextLesson { get; set; }
        public string Status { get; set; } = "active"; // "active" | "removal_pending"
        public string? LeaveReason { get; set; }
        /// <summary>Latest confirmed/pending booking id – used for cancel request</summary>
        public int LatestBookingId { get; set; }
    }
}
