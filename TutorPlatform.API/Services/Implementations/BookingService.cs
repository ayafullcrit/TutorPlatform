using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Booking;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Booking;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================
        // STUDENT: Tạo booking mới
        // ============================================
        public async Task<ApiResponse<BookingResponse>> CreateBookingAsync(
            int studentUserId,
            CreateBookingRequest request)
        {
            try
            {
                // 1. Kiểm tra student tồn tại
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.UserId == studentUserId);

                if (student == null)
                    return Fail<BookingResponse>("Chỉ học sinh mới có thể đặt lịch");

                // 2. Kiểm tra class tồn tại và còn chỗ
                var classEntity = await _context.Classes
                    .Include(c => c.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .FirstOrDefaultAsync(c => c.Id == request.ClassId);

                if (classEntity == null)
                    return Fail<BookingResponse>("Lớp học không tồn tại");

                if (classEntity.Status != ClassStatus.Active)
                    return Fail<BookingResponse>("Lớp học không còn hoạt động");

                if (classEntity.CurrentStudents >= classEntity.MaxStudents)
                    return Fail<BookingResponse>("Lớp học đã đầy");

                // 3. Kiểm tra student chưa đặt lớp này
                var existingBooking = await _context.Bookings
                    .FirstOrDefaultAsync(b =>
                        b.StudentId == studentUserId &&
                        b.ClassId == request.ClassId &&
                        b.Status != BookingStatus.Cancelled);

                if (existingBooking != null)
                    return Fail<BookingResponse>("Bạn đã đặt lớp học này rồi");

                // 4. Kiểm tra số dư (Balance)
                if (student.User.Balance < classEntity.PricePerSession)
                    return Fail<BookingResponse>(
                        $"Số dư không đủ. Cần {classEntity.PricePerSession:N0} VNĐ, hiện có {student.User.Balance:N0} VNĐ");

                // 5. Tính EndTime dựa trên DurationInMinutes
                var endTime = request.StartTime.AddMinutes(classEntity.DurationInMinutes);

                // 6. Tạo booking
                var booking = new Booking
                {
                    StudentId = studentUserId,
                    TutorId = classEntity.TutorId,
                    ClassId = request.ClassId,
                    BookingDate = DateTime.UtcNow,
                    StartTime = request.StartTime,
                    EndTime = endTime,
                    Status = BookingStatus.Pending,
                    Note = request.Note
                };

                // 7. Trừ tiền student
                student.User.Balance -= classEntity.PricePerSession;

                // 8. Tăng CurrentStudents
                classEntity.CurrentStudents++;

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                // 9. Reload để trả về đầy đủ thông tin
                var createdBooking = await GetBookingEntityAsync(booking.Id);
                return new ApiResponse<BookingResponse>(
                    MapToResponse(createdBooking!),
                    "Đặt lịch thành công! Vui lòng chờ gia sư xác nhận."
                );
            }
            catch (Exception ex)
            {
                return Fail<BookingResponse>("Lỗi khi đặt lịch: " + ex.Message);
            }
        }

        // ============================================
        // STUDENT: Xem lịch sử booking của mình
        // ============================================
        public async Task<ApiResponse<List<BookingResponse>>> GetMyBookingsAsStudentAsync(int studentUserId)
        {
            try
            {
                var bookings = await _context.Bookings
                    .Include(b => b.Class)
                        .ThenInclude(c => c.Subject)
                    .Include(b => b.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(b => b.Student)
                        .ThenInclude(s => s.User)
                    .Where(b => b.StudentId == studentUserId)
                    .OrderByDescending(b => b.BookingDate)
                    .ToListAsync();

                return new ApiResponse<List<BookingResponse>>(
                    bookings.Select(MapToResponse).ToList(),
                    "Lấy danh sách booking thành công"
                );
            }
            catch (Exception ex)
            {
                return Fail<List<BookingResponse>>("Lỗi: " + ex.Message);
            }
        }

        // ============================================
        // STUDENT: Hủy booking
        // ============================================
        public async Task<ApiResponse> CancelBookingByStudentAsync(int studentUserId, int bookingId)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Class)
                    .Include(b => b.Student)
                        .ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                    return new ApiResponse("Booking không tồn tại", false);

                if (booking.StudentId != studentUserId)
                    return new ApiResponse("Bạn không có quyền hủy booking này", false);

                if (booking.Status == BookingStatus.Completed)
                    return new ApiResponse("Không thể hủy booking đã hoàn thành", false);

                if (booking.Status == BookingStatus.Cancelled)
                    return new ApiResponse("Booking đã bị hủy trước đó", false);

                // Hoàn tiền nếu chưa confirmed
                if (booking.Status == BookingStatus.Pending)
                {
                    booking.Student.User.Balance += booking.Class.PricePerSession;
                }
                // Nếu đã confirmed: hoàn 80% (chính sách phạt 20%)
                else if (booking.Status == BookingStatus.Confirmed)
                {
                    var refundAmount = booking.Class.PricePerSession * 0.8m;
                    booking.Student.User.Balance += refundAmount;
                }

                // Giảm CurrentStudents
                booking.Class.CurrentStudents = Math.Max(0, booking.Class.CurrentStudents - 1);
                booking.Status = BookingStatus.Cancelled;

                await _context.SaveChangesAsync();

                return new ApiResponse("Hủy booking thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi khi hủy booking: " + ex.Message, false);
            }
        }

        // ============================================
        // TUTOR: Xem booking của lớp mình
        // ============================================
        public async Task<ApiResponse<List<BookingResponse>>> GetMyBookingsAsTutorAsync(int tutorUserId)
        {
            try
            {
                var bookings = await _context.Bookings
                    .Include(b => b.Class)
                        .ThenInclude(c => c.Subject)
                    .Include(b => b.Tutor)
                        .ThenInclude(t => t.User)
                    .Include(b => b.Student)
                        .ThenInclude(s => s.User)
                    .Where(b => b.TutorId == tutorUserId)
                    .OrderByDescending(b => b.BookingDate)
                    .ToListAsync();

                return new ApiResponse<List<BookingResponse>>(
                    bookings.Select(MapToResponse).ToList(),
                    "Lấy danh sách booking thành công"
                );
            }
            catch (Exception ex)
            {
                return Fail<List<BookingResponse>>("Lỗi: " + ex.Message);
            }
        }

        // ============================================
        // TUTOR: Xác nhận booking
        // ============================================
        public async Task<ApiResponse<BookingResponse>> ConfirmBookingAsync(int tutorUserId, int bookingId)
        {
            try
            {
                var booking = await GetBookingEntityAsync(bookingId);

                if (booking == null)
                    return Fail<BookingResponse>("Booking không tồn tại");

                if (booking.TutorId != tutorUserId)
                    return Fail<BookingResponse>("Bạn không có quyền xác nhận booking này");

                if (booking.Status != BookingStatus.Pending)
                    return Fail<BookingResponse>("Chỉ có thể xác nhận booking đang ở trạng thái Pending");

                booking.Status = BookingStatus.Confirmed;
                await _context.SaveChangesAsync();

                return new ApiResponse<BookingResponse>(
                    MapToResponse(booking),
                    "Xác nhận booking thành công"
                );
            }
            catch (Exception ex)
            {
                return Fail<BookingResponse>("Lỗi: " + ex.Message);
            }
        }

        // ============================================
        // TUTOR: Đánh dấu đã hoàn thành
        // ============================================
        public async Task<ApiResponse<BookingResponse>> CompleteBookingAsync(int tutorUserId, int bookingId)
        {
            try
            {
                var booking = await GetBookingEntityAsync(bookingId);

                if (booking == null)
                    return Fail<BookingResponse>("Booking không tồn tại");

                if (booking.TutorId != tutorUserId)
                    return Fail<BookingResponse>("Bạn không có quyền cập nhật booking này");

                if (booking.Status != BookingStatus.Confirmed)
                    return Fail<BookingResponse>("Chỉ có thể hoàn thành booking đã được xác nhận");

                booking.Status = BookingStatus.Completed;

                // Cộng tiền cho tutor (90% sau khi trừ phí platform 10%)
                var tutorUser = await _context.Users.FindAsync(booking.TutorId);
                if (tutorUser != null)
                {
                    tutorUser.Balance += booking.Class.PricePerSession * 0.9m;
                }

                await _context.SaveChangesAsync();

                return new ApiResponse<BookingResponse>(
                    MapToResponse(booking),
                    "Đánh dấu hoàn thành thành công"
                );
            }
            catch (Exception ex)
            {
                return Fail<BookingResponse>("Lỗi: " + ex.Message);
            }
        }

        // ============================================
        // TUTOR: Từ chối/Hủy booking
        // ============================================
        public async Task<ApiResponse> CancelBookingByTutorAsync(int tutorUserId, int bookingId)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Class)
                    .Include(b => b.Student)
                        .ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                    return new ApiResponse("Booking không tồn tại", false);

                if (booking.TutorId != tutorUserId)
                    return new ApiResponse("Bạn không có quyền hủy booking này", false);

                if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
                    return new ApiResponse("Không thể hủy booking ở trạng thái này", false);

                // Hoàn tiền 100% cho student khi tutor hủy
                booking.Student.User.Balance += booking.Class.PricePerSession;
                booking.Class.CurrentStudents = Math.Max(0, booking.Class.CurrentStudents - 1);
                booking.Status = BookingStatus.Cancelled;

                await _context.SaveChangesAsync();

                return new ApiResponse("Đã hủy và hoàn tiền cho học sinh", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }

        // ============================================
        // SHARED: Xem chi tiết booking
        // ============================================
        public async Task<ApiResponse<BookingResponse>> GetBookingByIdAsync(int bookingId, int userId)
        {
            try
            {
                var booking = await GetBookingEntityAsync(bookingId);

                if (booking == null)
                    return Fail<BookingResponse>("Booking không tồn tại");

                // Chỉ student hoặc tutor của booking mới xem được
                if (booking.StudentId != userId && booking.TutorId != userId)
                    return Fail<BookingResponse>("Bạn không có quyền xem booking này");

                return new ApiResponse<BookingResponse>(
                    MapToResponse(booking),
                    "Lấy thông tin booking thành công"
                );
            }
            catch (Exception ex)
            {
                return Fail<BookingResponse>("Lỗi: " + ex.Message);
            }
        }

        // ============================================
        // HELPERS
        // ============================================
        private async Task<Booking?> GetBookingEntityAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.Class)
                    .ThenInclude(c => c.Subject)
                .Include(b => b.Tutor)
                    .ThenInclude(t => t.User)
                .Include(b => b.Student)
                    .ThenInclude(s => s.User)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
        }

        private BookingResponse MapToResponse(Booking booking)
        {
            var (statusText, statusColor) = booking.Status switch
            {
                BookingStatus.Pending => ("⏳ Chờ xác nhận", "warning"),
                BookingStatus.Confirmed => ("✅ Đã xác nhận", "success"),
                BookingStatus.Completed => ("🎓 Hoàn thành", "info"),
                BookingStatus.Cancelled => ("❌ Đã hủy", "danger"),
                BookingStatus.NoShow => ("🚫 Không đến", "secondary"),
                _ => ("Unknown", "secondary")
            };

            return new BookingResponse
            {
                Id = booking.Id,

                StudentUserId = booking.StudentId,
                StudentName = booking.Student?.User?.FullName ?? "Unknown",
                StudentAvatar = booking.Student?.User?.AvatarUrl,

                TutorUserId = booking.TutorId,
                TutorName = booking.Tutor?.User?.FullName ?? "Unknown",
                TutorAvatar = booking.Tutor?.User?.AvatarUrl,

                ClassId = booking.ClassId,
                ClassTitle = booking.Class?.Title ?? "Unknown",
                SubjectName = booking.Class?.Subject?.Name ?? "Unknown",
                PricePerSession = booking.Class?.PricePerSession ?? 0,
                DurationMinutes = booking.Class?.DurationInMinutes ?? 0,

                BookingDate = booking.BookingDate,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                Note = booking.Note,

                Status = booking.Status,
                StatusText = statusText,
                StatusColor = statusColor
            };
        }

        private ApiResponse<T> Fail<T>(string message) =>
            new ApiResponse<T>(message, new List<string> { message });
    }
}