using TutorPlatform.API.Models.DTOs.Requests.Booking;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Booking;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface IEnrollmentService
    {
        /// <summary>Học viên đăng ký vào lớp (không trừ tiền, không cần chọn giờ)</summary>
        Task<ApiResponse<ClassEnrollmentResponse>> EnrollAsync(int studentUserId, EnrollClassRequest request);

        /// <summary>Lấy danh sách lớp học viên đang theo học (active enrollments)</summary>
        Task<ApiResponse<List<ClassEnrollmentResponse>>> GetMyEnrollmentsAsync(int studentUserId);

        /// <summary>Lấy danh sách enrollments cho gia sư (bao gồm Pending và Active)</summary>
        Task<ApiResponse<List<ClassEnrollmentResponse>>> GetTutorEnrollmentsAsync(int tutorUserId);

        /// <summary>Gia sư phê duyệt học viên vào lớp</summary>
        Task<ApiResponse> ApproveEnrollmentAsync(int tutorUserId, int enrollmentId);

        /// <summary>Gia sư từ chối yêu cầu đăng ký lớp</summary>
        Task<ApiResponse> RejectEnrollmentAsync(int tutorUserId, int enrollmentId);

        /// <summary>Học viên xin nghỉ – xóa ngay, hoàn tiền các session pending/confirmed</summary>
        Task<ApiResponse> LeaveClassAsync(int studentUserId, int enrollmentId);

        /// <summary>Gia sư xóa học viên khỏi lớp – hoàn tiền các session chưa diễn ra</summary>
        Task<ApiResponse> RemoveStudentAsync(int tutorUserId, int enrollmentId);

        /// <summary>Đặt một buổi học cụ thể trong lớp đã enroll (trừ tiền)</summary>
        Task<ApiResponse<BookingResponse>> ScheduleSessionAsync(int studentUserId, ScheduleSessionRequest request);

        /// <summary>Lấy các slot rảnh của gia sư phụ trách lớp trong tuần chỉ định</summary>
        Task<ApiResponse<List<Models.DTOs.Responses.Tutor.AvailableSlotResponse>>> GetAvailableSlotsAsync(int classId, DateTime weekStart);
    }
}
