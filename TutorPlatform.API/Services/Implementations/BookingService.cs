using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Booking;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Booking;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Helpers;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IPaymentService _paymentService;
        private const decimal PlatformFeeRate = 0.10m;
        private const decimal TutorPayoutRate = 1.0m - PlatformFeeRate;
        private const string LeaveRequestPrefix = "LEAVE_REQUEST:";

        public BookingService(ApplicationDbContext context,
        IPaymentService paymentService,
        INotificationService notificationService)
        {
            _context = context;
            _paymentService = paymentService;
            _notificationService = notificationService;

        }

        private static decimal GetTutorPayout(decimal grossAmount) =>
            Math.Round(grossAmount * TutorPayoutRate, 2, MidpointRounding.AwayFromZero);

        private async Task<bool> HasTutorPayoutTransactionAsync(int tutorUserId, int bookingId) =>
            await _context.Transactions.AnyAsync(t =>
                t.UserId == tutorUserId &&
                t.Type == TransactionType.Earning &&
                t.ReferenceId == bookingId.ToString() &&
                t.Amount > 0);

        // ============================================
        // STUDENT: Danh sách gia sư đang học
        // ============================================
        public async Task<ApiResponse<List<MyTutorResponse>>> GetMyTutorsAsync(int studentUserId)
        {
            try
            {
                var studentExists = await _context.Students.AnyAsync(s => s.UserId == studentUserId);
                if (!studentExists)
                    return Fail<List<MyTutorResponse>>("Chỉ học sinh mới có thể xem danh sách gia sư");

                var bookings = await _context.Bookings
                    .Include(b => b.Class)
                        .ThenInclude(c => c.Subject)
                    .Include(b => b.Tutor)
                        .ThenInclude(t => t.User)
                    .Where(b => b.StudentId == studentUserId && b.Status != BookingStatus.Cancelled)
                    .ToListAsync();

                if (bookings.Count == 0)
                    return new ApiResponse<List<MyTutorResponse>>(new List<MyTutorResponse>(), "Không có gia sư nào");

                var now = DateTime.UtcNow;
                var tutorIds = bookings.Select(b => b.TutorId).Distinct().ToList();

                var ratings = await _context.Reviews
                    .Where(r => tutorIds.Contains(r.TutorId))
                    .GroupBy(r => r.TutorId)
                    .Select(g => new { TutorId = g.Key, Avg = g.Average(x => (double)x.Rating) })
                    .ToDictionaryAsync(x => x.TutorId, x => x.Avg);

                var result = bookings
                    .GroupBy(b => b.TutorId)
                    .Select(g =>
                    {
                        var latestBooking = g.OrderByDescending(b => b.StartTime).First();
                        var next = g
                            .Where(b => b.StartTime > now && (b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.Pending))
                            .OrderBy(b => b.StartTime)
                            .FirstOrDefault();

                        var leaveReason = ExtractLeaveReason(latestBooking.Note);
                        var status = string.IsNullOrWhiteSpace(leaveReason) ? "active" : "removal_pending";

                        return new MyTutorResponse
                        {
                            TutorUserId = latestBooking.TutorId,
                            TutorName = latestBooking.Tutor?.User?.FullName ?? string.Empty,
                            TutorAvatar = latestBooking.Tutor?.User?.AvatarUrl ?? string.Empty,
                            Subject = latestBooking.Class?.Subject?.Name ?? string.Empty,
                            City = latestBooking.Tutor?.User?.Address ?? string.Empty,
                            PricePerSession = latestBooking.Class?.PricePerSession ?? 0,
                            Rating = ratings.TryGetValue(latestBooking.TutorId, out var avg) ? Math.Round(avg, 1) : 0,
                            NextLesson = next == null ? "--" : FormatLessonTime(next.StartTime),
                            Status = status,
                            LeaveReason = leaveReason,
                            LatestBookingId = latestBooking.Id
                        };
                    })
                    .OrderBy(x => x.TutorName)
                    .ToList();

                return new ApiResponse<List<MyTutorResponse>>(result, "Lấy danh sách gia sư thành công");
            }
            catch (Exception ex)
            {
                return Fail<List<MyTutorResponse>>("Lỗi: " + ex.Message);
            }
        }

        // ============================================
        // STUDENT: Xin nghỉ học với gia sư (gửi yêu cầu)
        // ============================================
        public async Task<ApiResponse<MyTutorResponse>> RequestCancelBookingAsync(int studentUserId, int bookingId, string reason)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(reason))
                    return Fail<MyTutorResponse>("Vui lòng nhập lý do");

                var booking = await _context.Bookings
                    .Include(b => b.Class)
                        .ThenInclude(c => c.Subject)
                    .Include(b => b.Tutor)
                        .ThenInclude(t => t.User)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                    return Fail<MyTutorResponse>("Booking không tồn tại");

                if (booking.StudentId != studentUserId)
                    return Fail<MyTutorResponse>("Bạn không có quyền gửi yêu cầu cho booking này");

                if (booking.Status == BookingStatus.Cancelled || booking.Status == BookingStatus.Completed)
                    return Fail<MyTutorResponse>("Không thể gửi yêu cầu ở trạng thái booking hiện tại");

                booking.Note = $"{LeaveRequestPrefix} {reason}".Trim();
                await _context.SaveChangesAsync();

                await _notificationService.CreateAsync(
                    userId: booking.TutorId,
                    title: "Yêu cầu nghỉ học",
                    message: $"Học viên đã gửi yêu cầu nghỉ học cho lớp \"{booking.Class?.Title ?? "lớp học"}\". Lý do: {reason}",
                    type: "booking"
                );

                var avgRating = await _context.Reviews
                    .Where(r => r.TutorId == booking.TutorId)
                    .AverageAsync(r => (double?)r.Rating) ?? 0;

                var response = new MyTutorResponse
                {
                    TutorUserId = booking.TutorId,
                    TutorName = booking.Tutor?.User?.FullName ?? string.Empty,
                    TutorAvatar = booking.Tutor?.User?.AvatarUrl ?? string.Empty,
                    Subject = booking.Class?.Subject?.Name ?? string.Empty,
                    City = booking.Tutor?.User?.Address ?? string.Empty,
                    PricePerSession = booking.Class?.PricePerSession ?? 0,
                    Rating = Math.Round(avgRating, 1),
                    NextLesson = "--",
                    Status = "removal_pending",
                    LeaveReason = reason,
                    LatestBookingId = booking.Id
                };

                return new ApiResponse<MyTutorResponse>(response, "Đã gửi yêu cầu nghỉ học");
            }
            catch (Exception ex)
            {
                return Fail<MyTutorResponse>("Lỗi: " + ex.Message);
            }
        }

        private static string? ExtractLeaveReason(string? note)
        {
            if (string.IsNullOrWhiteSpace(note))
                return null;

            if (!note.TrimStart().StartsWith(LeaveRequestPrefix, StringComparison.OrdinalIgnoreCase))
                return null;

            var trimmed = note.Trim();
            var idx = trimmed.IndexOf(':');
            if (idx < 0 || idx >= trimmed.Length - 1)
                return null;

            var reason = trimmed[(idx + 1)..].Trim();
            return string.IsNullOrWhiteSpace(reason) ? null : reason;
        }

        private static string FormatLessonTime(DateTime utcStartTime) =>
            utcStartTime.ToLocalTime().ToString("dd/MM/yyyy HH:mm");
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

                // 5.1. Kiểm tra trùng lịch học viên
                var isStudentBusy = await _context.Bookings.AnyAsync(b =>
                    b.StudentId == studentUserId &&
                    (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                    b.StartTime < endTime && b.EndTime > request.StartTime);

                if (isStudentBusy)
                    return Fail<BookingResponse>("Bạn đã có lịch học khác trong khoảng thời gian này");

                // 5.2. Kiểm tra trùng lịch gia sư
                var isTutorBusy = await _context.Bookings.AnyAsync(b =>
                    b.TutorId == classEntity.TutorId &&
                    (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                    b.StartTime < endTime && b.EndTime > request.StartTime);

                if (isTutorBusy)
                    return Fail<BookingResponse>("Gia sư đã có lịch dạy khác trong khoảng thời gian này");

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
                // student.User.Balance -= classEntity.PricePerSession;
                await _paymentService.RecordTransactionAsync(
                     studentUserId,
                     -classEntity.PricePerSession,          // âm = trừ
                     TransactionType.BookingPay,
                     $"Thanh toán lớp: {classEntity.Title}",
                     referenceId: request.ClassId.ToString()
                 );

                // 8. Tăng CurrentStudents
                classEntity.CurrentStudents++;

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                await BookingNotifications.OnBookingCreated(
                    _notificationService,
                    tutorUserId: classEntity.TutorId,
                    studentUserId: studentUserId,
                    bookingId: booking.Id,
                    studentName: student.User.FullName,
                    classTitle: classEntity.Title
                );


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
                //if (booking.Status == BookingStatus.Pending)
                //{
                //    booking.Student.User.Balance += booking.Class.PricePerSession;
                //}
                //// Nếu đã confirmed: hoàn 80% (chính sách phạt 20%)
                //else if (booking.Status == BookingStatus.Confirmed)
                //{
                //    var refundAmount = booking.Class.PricePerSession * 0.8m;
                //    booking.Student.User.Balance += refundAmount;
                //}
                var refundAmount = booking.Status == BookingStatus.Pending
                    ? booking.Class.PricePerSession
                    : booking.Class.PricePerSession * 0.8m;

                await _paymentService.RecordTransactionAsync(
                    booking.StudentId,
                    refundAmount,
                    TransactionType.Refund,
                    $"Hoàn tiền hủy lớp: {booking.Class.Title}",
                    referenceId: bookingId.ToString()
                );
                if (booking.Status == BookingStatus.Confirmed &&
                    await HasTutorPayoutTransactionAsync(booking.TutorId, booking.Id))
                {
                    var grossKept = booking.Class.PricePerSession - refundAmount; // phần HS bị mất do hủy
                    var alreadyPaid = GetTutorPayout(booking.Class.PricePerSession);
                    var desiredNet = GetTutorPayout(Math.Max(0, grossKept));
                    var clawback = alreadyPaid - desiredNet;

                    if (clawback > 0)
                    {
                        await _paymentService.RecordTransactionAsync(
                            booking.TutorId,
                            -clawback,
                            TransactionType.Earning,
                            $"Payout adjustment (student refund): {booking.Class.Title}",
                            referenceId: booking.Id.ToString()
                        );
                    }
                }

                // Giảm CurrentStudents
                booking.Class.CurrentStudents = Math.Max(0, booking.Class.CurrentStudents - 1);
                booking.Status = BookingStatus.Cancelled;

                await _context.SaveChangesAsync();
                await BookingNotifications.OnBookingCancelledByStudent(
                   _notificationService,
                   tutorUserId: booking.TutorId,
                   studentUserId: booking.StudentId,
                   bookingId: bookingId,
                   studentName: booking.Student.User.FullName,
                   classTitle: booking.Class.Title,
                   refundAmount: refundAmount  
               );

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

                if (!await HasTutorPayoutTransactionAsync(booking.TutorId, booking.Id))
                {
                    var tutorPayout = GetTutorPayout(booking.Class.PricePerSession);
                    await _paymentService.RecordTransactionAsync(
                        booking.TutorId,
                        tutorPayout,
                        TransactionType.Earning,
                        $"Thu nháº­p tá»« lá»›p: {booking.Class.Title}",
                        referenceId: booking.Id.ToString()
                    );
                }

                await _context.SaveChangesAsync();
                await BookingNotifications.OnBookingConfirmed(
                    _notificationService,
                    studentUserId: booking.StudentId,
                    bookingId: bookingId,
                    tutorName: booking.Tutor.User.FullName,
                    classTitle: booking.Class.Title

                );

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
                if (!await HasTutorPayoutTransactionAsync(booking.TutorId, booking.Id))
                {
                    var tutorPayout = GetTutorPayout(booking.Class.PricePerSession);
                    await _paymentService.RecordTransactionAsync(
                        booking.TutorId,
                        tutorPayout,
                        TransactionType.Earning,
                        $"Thu nháº­p tá»« lá»›p: {booking.Class.Title}",
                        referenceId: booking.Id.ToString()
                    );
                }

                await _context.SaveChangesAsync();
                await BookingNotifications.OnBookingCompleted(
                    _notificationService,
                    studentUserId: booking.StudentId,
                    tutorUserId: booking.TutorId,
                    bookingId: bookingId,
                    classTitle: booking.Class.Title,
                    tutorEarning: GetTutorPayout(booking.Class.PricePerSession)
                );

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
                    .Include(b => b.Tutor)
                        .ThenInclude(t => t.User)
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
                await _paymentService.RecordTransactionAsync(
                    booking.StudentId,
                    booking.Class.PricePerSession,
                    TransactionType.Refund,
                    $"Hoàn tiền hủy lớp bởi gia sư: {booking.Class.Title}",
                    referenceId: bookingId.ToString()
                );


                if (booking.Status == BookingStatus.Confirmed &&
                    await HasTutorPayoutTransactionAsync(booking.TutorId, booking.Id))
                {
                    var tutorPayout = GetTutorPayout(booking.Class.PricePerSession);
                    await _paymentService.RecordTransactionAsync(
                        booking.TutorId,
                        -tutorPayout,
                        TransactionType.Earning,
                        $"Payout reversal (booking cancelled): {booking.Class.Title}",
                        referenceId: booking.Id.ToString()
                    );
                }
                booking.Class.CurrentStudents = Math.Max(0, booking.Class.CurrentStudents - 1);
                booking.Status = BookingStatus.Cancelled;

                await _context.SaveChangesAsync();
                await BookingNotifications.OnBookingCancelledByTutor(
                    _notificationService,
                    studentUserId: booking.StudentId,
                    bookingId: bookingId,
                    tutorName: booking.Tutor.User.FullName,
                    classTitle: booking.Class.Title,
                    refundAmount: booking.Class.PricePerSession
                );

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

                BookingDate = DateTime.SpecifyKind(booking.BookingDate, DateTimeKind.Utc),
                StartTime = DateTime.SpecifyKind(booking.StartTime, DateTimeKind.Utc),
                EndTime = DateTime.SpecifyKind(booking.EndTime, DateTimeKind.Utc),
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
