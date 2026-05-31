using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.Entities
{
    public class PlatformSetting
    {
        [Key]
        public int Id { get; set; }
        public decimal PlatformFeeRate { get; set; } = 0.10m;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
