namespace TutorPlatform.API.Models.DTOs.Responses.Notification
{
    public class NotificationResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }        // "Booking", "Payment", "System"
        public string TypeIcon { get; set; }   
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string TimeAgo { get; set; }
        public string? RelatedData { get; set; } // JSON string để navigate
    }

    public class NotificationSummary
    {
        public int UnreadCount { get; set; }
        public List<NotificationResponse> Notifications { get; set; }
    }
}