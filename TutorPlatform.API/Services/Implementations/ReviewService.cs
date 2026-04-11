using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Review;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Review;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;

        public ReviewService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<ReviewResponse>> CreateReviewAsync(
            int studentUserId,
            CreateReviewRequest request)
        {
            try
            {
                // 1. Kiểm tra student tồn tại
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.UserId == studentUserId);

                if (student == null)
                    return Fail<ReviewResponse>("Chỉ học sinh mới có thể đánh giá");

                // 2. Kiểm tra booking hợp lệ: phải là Completed, đúng student, đúng tutor
                var booking = await _context.Bookings
                    .Include(b => b.Class)
                    .FirstOrDefaultAsync(b =>
                        b.Id == request.BookingId &&
                        b.StudentId == studentUserId &&
                        b.TutorId == request.TutorId &&
                        b.Status == BookingStatus.Completed);

                if (booking == null)
                    return Fail<ReviewResponse>(
                        "Bạn chỉ có thể đánh giá gia sư sau khi hoàn thành buổi học");

                // 3. Kiểm tra chưa review tutor này (unique constraint StudentId+TutorId)
                var existing = await _context.Reviews
                    .FirstOrDefaultAsync(r =>
                        r.StudentId == studentUserId &&
                        r.TutorId == request.TutorId);

                if (existing != null)
                    return Fail<ReviewResponse>("Bạn đã đánh giá gia sư này rồi");

                // 4. Tạo review
                var review = new Review
                {
                    StudentId = studentUserId,
                    TutorId = request.TutorId,
                    Rating = request.Rating,
                    Comment = request.Comment,
                    CreatedAt = DateTime.UtcNow,
                    IsVerified = true   // auto-verify vì đã check booking Completed
                };

                _context.Reviews.Add(review);

                // 5. Cập nhật Rating và TotalReviews của Tutor
                await UpdateTutorRatingAsync(request.TutorId);

                await _context.SaveChangesAsync();

                // Reload để lấy đủ navigation properties
                var created = await GetReviewWithDetailsAsync(review.Id);

                return new ApiResponse<ReviewResponse>(
                    MapToResponse(created!),
                    "Đánh giá thành công! Cảm ơn bạn đã phản hồi."
                );
            }
            catch (Exception ex)
            {
                return Fail<ReviewResponse>("Lỗi khi tạo đánh giá: " + ex.Message);
            }
        }

        public async Task<ApiResponse<TutorRatingSummary>> GetTutorReviewsAsync(int tutorId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Include(r => r.Student)
                        .ThenInclude(s => s.User)
                    .Include(r => r.Tutor)
                        .ThenInclude(t => t.User)
                    .Where(r => r.TutorId == tutorId && r.IsVerified)
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();

                if (!reviews.Any())
                {
                    return new ApiResponse<TutorRatingSummary>(
                        new TutorRatingSummary
                        {
                            AverageRating = 0,
                            TotalReviews = 0,
                            RatingBreakdown = new Dictionary<int, int>
                                { {5,0},{4,0},{3,0},{2,0},{1,0} },
                            Reviews = new List<ReviewResponse>()
                        },
                        "Chưa có đánh giá nào"
                    );
                }

                var breakdown = new Dictionary<int, int> { { 5, 0 }, { 4, 0 }, { 3, 0 }, { 2, 0 }, { 1, 0 } };
                foreach (var r in reviews)
                    breakdown[r.Rating]++;

                double avg = reviews.Average(r => r.Rating);

                var summary = new TutorRatingSummary
                {
                    AverageRating = Math.Round(avg, 1),
                    TotalReviews = reviews.Count,
                    RatingBreakdown = breakdown,
                    Reviews = reviews.Select(MapToResponse).ToList()
                };

                return new ApiResponse<TutorRatingSummary>(summary, "Lấy đánh giá thành công");
            }
            catch (Exception ex)
            {
                return Fail<TutorRatingSummary>("Lỗi: " + ex.Message);
            }
        }

        public async Task<ApiResponse<ReviewResponse>> GetMyReviewForTutorAsync(
            int studentUserId, int tutorId)
        {
            try
            {
                var review = await _context.Reviews
                    .Include(r => r.Student).ThenInclude(s => s.User)
                    .Include(r => r.Tutor).ThenInclude(t => t.User)
                    .FirstOrDefaultAsync(r =>
                        r.StudentId == studentUserId && r.TutorId == tutorId);

                if (review == null)
                    return Fail<ReviewResponse>("Bạn chưa đánh giá gia sư này");

                return new ApiResponse<ReviewResponse>(
                    MapToResponse(review),
                    "OK"
                );
            }
            catch (Exception ex)
            {
                return Fail<ReviewResponse>("Lỗi: " + ex.Message);
            }
        }

        public async Task<ApiResponse> DeleteReviewAsync(int studentUserId, int reviewId)
        {
            try
            {
                var review = await _context.Reviews
                    .FirstOrDefaultAsync(r => r.Id == reviewId);

                if (review == null)
                    return new ApiResponse("Review không tồn tại", false);

                if (review.StudentId != studentUserId)
                    return new ApiResponse("Bạn không có quyền xoá đánh giá này", false);

                _context.Reviews.Remove(review);

                // Recalculate tutor rating sau khi xoá
                await UpdateTutorRatingAsync(review.TutorId);

                await _context.SaveChangesAsync();

                return new ApiResponse("Xoá đánh giá thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }  
        // Cập nhật rating tổng hợp của Tutor
        private async Task UpdateTutorRatingAsync(int tutorId)
        {
            var tutor = await _context.Tutors.FindAsync(tutorId);
            if (tutor == null) return;

            // Lấy tất cả reviews hiện tại (chưa save review mới)
            var allRatings = await _context.Reviews
                .Where(r => r.TutorId == tutorId && r.IsVerified)
                .Select(r => r.Rating)
                .ToListAsync();

            if (allRatings.Any())
            {
                tutor.Rating = Math.Round(allRatings.Average(), 1);
                tutor.TotalReviews = allRatings.Count;
            }
            else
            {
                tutor.Rating = 0;
                tutor.TotalReviews = 0;
            }
        }

        private async Task<Review?> GetReviewWithDetailsAsync(int reviewId)
        {
            return await _context.Reviews
                .Include(r => r.Student).ThenInclude(s => s.User)
                .Include(r => r.Tutor).ThenInclude(t => t.User)
                .FirstOrDefaultAsync(r => r.Id == reviewId);
        }

        private ReviewResponse MapToResponse(Review review)
        {
            var stars = new string('★', review.Rating) + new string('☆', 5 - review.Rating);
            var timeAgo = GetTimeAgo(review.CreatedAt);

            return new ReviewResponse
            {
                Id = review.Id,
                StudentId = review.StudentId,
                StudentName = review.Student?.User?.FullName ?? "Ẩn danh",
                StudentAvatar = review.Student?.User?.AvatarUrl,
                TutorId = review.TutorId,
                TutorName = review.Tutor?.User?.FullName ?? "Unknown",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                IsVerified = review.IsVerified,
                RatingStars = stars,
                TimeAgo = timeAgo
            };
        }

        private string GetTimeAgo(DateTime createdAt)
        {
            var diff = DateTime.UtcNow - createdAt;
            if (diff.TotalMinutes < 1) return "vừa xong";
            if (diff.TotalHours < 1) return $"{(int)diff.TotalMinutes} phút trước";
            if (diff.TotalDays < 1) return $"{(int)diff.TotalHours} giờ trước";
            if (diff.TotalDays < 30) return $"{(int)diff.TotalDays} ngày trước";
            if (diff.TotalDays < 365) return $"{(int)(diff.TotalDays / 30)} tháng trước";
            return $"{(int)(diff.TotalDays / 365)} năm trước";
        }

        private ApiResponse<T> Fail<T>(string message) =>
            new ApiResponse<T>(message, new List<string> { message });
    }
}