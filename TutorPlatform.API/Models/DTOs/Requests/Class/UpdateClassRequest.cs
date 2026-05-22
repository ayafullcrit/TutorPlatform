using System.ComponentModel.DataAnnotations;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Requests.Class
{
    public class UpdateClassRequest
    {
      //  [Required]
        public int SubjectId {  get; set; }

     //   [Required]
        [StringLength(200)]
        public string Title {  get; set; }

      //  [Required]
        [StringLength(2000)]
        public string Description {  get; set; }
        public int DurationMinutes { get; set; }
        public string ThumbnailUrl { get; set; }
   //     [Required]
        [Range(0, 10000000)]
        public decimal PricePerSession { get; set; }
        public int? TotalSessions { get; set; }

        [Range(1, 50)]
        public int MaxStudents { get; set; }

      //  [Required]
        public ClassStatus Status { get; set; }
    }
}