using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int TutorId { get; set; }
        public int ClassId { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public BookingStatus Status { get; set; }
        public string Note { get; set; }
        public Student Student { get; set; }
        public Tutor Tutor { get; set; } 
        public Class Class { get; set; }
        public Payment Payment { get; set; }
    }
}