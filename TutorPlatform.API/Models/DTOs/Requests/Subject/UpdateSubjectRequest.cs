using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Subject
{
    public class UpdateSubjectRequest
    {
        [Required]
        [StringLength(80)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
