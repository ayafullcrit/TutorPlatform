using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.DTOs.Responses.User
{
    public class UpdateProfileResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string AvatarUrl { get; set; }
        public decimal Balance { get; set; }
        public UserRole Role { get; set; }
        public StudentProfile Student { get; set; }
        public TutorProfile Tutor { get; set; }
    }
    public class StudentProfile
    {
        public int UserId { get; set; }
        public int GradeLevel { get; set; }
        public string School { get; set; }
        //public string LearningGoals { get; set; }
    }

    public class TutorProfile
    {
        public int UserId { get; set; }
        public string Bio { get; set; }
        //public string Education { get; set; }
        //public string Experience { get; set; }
        public decimal HourlyRate { get; set; }
        //public string VideoIntro { get; set; }
        public bool IsVerified { get; set; }
        public double Rating { get; set; }
        public int TotalReviews { get; set; }
        public int TotalHoursTaught { get; set; }
    }
}

