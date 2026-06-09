using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Tutor
{
    public class SetAvailabilityRequest
    {
        [Required]
        public List<AvailabilitySlotInput> Slots { get; set; } = new();
    }

    public class AvailabilitySlotInput
    {
        /// <summary>0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7</summary>
        [Range(0, 6)]
        public int DayOfWeek { get; set; }

        /// <summary>Format "HH:mm" e.g. "08:00"</summary>
        [Required]
        public string StartTime { get; set; } = "";

        /// <summary>Format "HH:mm" e.g. "11:00"</summary>
        [Required]
        public string EndTime { get; set; } = "";
    }
}
