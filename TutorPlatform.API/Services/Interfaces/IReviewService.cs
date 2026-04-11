using TutorPlatform.API.Models.DTOs.Requests.Review;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Review;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ApiResponse<ReviewResponse>> CreateReviewAsync(int studentUserId, CreateReviewRequest request);
        Task<ApiResponse<TutorRatingSummary>> GetTutorReviewsAsync(int tutorId);
        Task<ApiResponse<ReviewResponse>> GetMyReviewForTutorAsync(int studentUserId, int tutorId);
        Task<ApiResponse> DeleteReviewAsync(int studentUserId, int reviewId);
    }
}