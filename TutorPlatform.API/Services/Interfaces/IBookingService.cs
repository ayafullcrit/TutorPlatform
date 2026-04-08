using TutorPlatform.API.Models.DTOs.Requests.Booking;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Booking;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface IBookingService
    {
        // Student actions
        Task<ApiResponse<BookingResponse>> CreateBookingAsync(int studentUserId, CreateBookingRequest request);
        Task<ApiResponse<List<BookingResponse>>> GetMyBookingsAsStudentAsync(int studentUserId);
        Task<ApiResponse> CancelBookingByStudentAsync(int studentUserId, int bookingId);

        // Tutor actions
        Task<ApiResponse<List<BookingResponse>>> GetMyBookingsAsTutorAsync(int tutorUserId);
        Task<ApiResponse<BookingResponse>> ConfirmBookingAsync(int tutorUserId, int bookingId);
        Task<ApiResponse<BookingResponse>> CompleteBookingAsync(int tutorUserId, int bookingId);
        Task<ApiResponse> CancelBookingByTutorAsync(int tutorUserId, int bookingId);

        // Shared
        Task<ApiResponse<BookingResponse>> GetBookingByIdAsync(int bookingId, int userId);
    }
}