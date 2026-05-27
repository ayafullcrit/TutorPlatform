using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.User
{
    public class UpdateProfileRequest
    {
        [Required]
        [StringLength(200)]
        public string FullName { get; set;  }
        [Phone]
        public string PhoneNumber { get; set; }
        [StringLength(500)]
        public string Address { get; set; }
        public string AvatarUrl {  get; set; }
    }
    public class UpdateStudentProfileRequest
    {
        [Range(1, 12)]
        public int GradeLevel { get; set; }
        public string School { get; set; } = string.Empty;
        //public string LearningGoals;
    }
    public class UpdateTutorProfileRequest
    {
        [Required]
        public string Bio {  get; set; }
        public string Education { get; set; }
        public string Experience { get; set; }
        public int TotalReviews { get; set; }
        public double Rating { get; set; }

        [Range(0, 10000000)]
        public decimal HourlyRate { get; set; }

        public string VideoIntro { get; set; }
    }
}
