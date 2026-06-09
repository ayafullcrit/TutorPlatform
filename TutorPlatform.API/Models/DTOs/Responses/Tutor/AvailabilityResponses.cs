namespace TutorPlatform.API.Models.DTOs.Responses.Tutor
{
    public class AvailableSlotResponse
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsAvailable { get; set; } = true;
    }

    public class TutorAvailabilityResponse
    {
        public int Id { get; set; }
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; } = "";
        public string EndTime { get; set; } = "";
    }
}
