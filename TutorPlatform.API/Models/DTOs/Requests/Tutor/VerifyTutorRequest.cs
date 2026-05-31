using System.ComponentModel.DataAnnotations;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Requests.Tutor
{
    public class VerifyTutorRequest
    {
        [Required]
        public VerificationStatus Status { get; set; }
        public string? Note { get; set; }
    }
}
