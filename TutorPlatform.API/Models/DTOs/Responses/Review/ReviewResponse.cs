namespace TutorPlatform.API.Models.DTOs.Responses.Review
{
    public class ReviewResponse
    {
        public int Id { get; set; }

        // Student info
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentAvatar { get; set; }

        // Tutor info
        public int TutorId { get; set; }
        public string TutorName { get; set; }

        // Review content
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsVerified { get; set; }

        // Computed
        public string RatingStars { get; set; }    
        public string TimeAgo { get; set; }       
    }

    public class TutorRatingSummary
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public Dictionary<int, int> RatingBreakdown { get; set; } 
        public List<ReviewResponse> Reviews { get; set; }
    }
}