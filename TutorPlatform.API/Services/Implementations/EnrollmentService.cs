using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Booking;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Booking;
using TutorPlatform.API.Models.DTOs.Responses.Tutor;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPaymentService _paymentService;
        private readonly INotificationService _notificationService;
        private const decimal PlatformFeeRate = 0.10m;
        private const decimal TutorPayoutRate = 1.0m - PlatformFeeRate;

        public EnrollmentService(ApplicationDbContext context, IPaymentService paymentService, INotificationService notificationService)
        {
            _context = context;
            _paymentService = paymentService;
            _notificationService = notificationService;
        }

        // ============================================================
        // ENROLL – Học viên đăng ký lớp (không trừ tiền, không cần giờ)
        // ============================================================
        public async Task<ApiResponse<ClassEnrollmentResponse>> EnrollAsync(int studentUserId, EnrollClassRequest request)
        {
            try
            {
                var student = await _context.Students.Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.UserId == studentUserId);
                if (student == null)
                    return Fail<ClassEnrollmentResponse>("Chỉ học sinh mới có thể đăng ký lớp học");

                var cls = await _context.Classes
                    .Include(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .FirstOrDefaultAsync(c => c.Id == request.ClassId);
                if (cls == null) return Fail<ClassEnrollmentResponse>("Lớp học không tồn tại");
                if (cls.Status != ClassStatus.Active) return Fail<ClassEnrollmentResponse>("Lớp học không còn hoạt động");
                if (cls.CurrentStudents >= cls.MaxStudents) return Fail<ClassEnrollmentResponse>("Lớp học đã đầy");

                // Kiểm tra đã enroll chưa
                var existing = await _context.ClassEnrollments.FirstOrDefaultAsync(e =>
                    e.StudentId == studentUserId && e.ClassId == request.ClassId && 
                    (e.Status == EnrollmentStatus.Active || e.Status == EnrollmentStatus.Pending));
                if (existing != null) return Fail<ClassEnrollmentResponse>("Bạn đã gửi yêu cầu hoặc đang học lớp này rồi");

                var enrollment = new ClassEnrollment
                {
                    StudentId = studentUserId,
                    ClassId = request.ClassId,
                    EnrolledAt = DateTime.UtcNow,
                    Status = EnrollmentStatus.Pending,
                    Note = request.Note
                };

                _context.ClassEnrollments.Add(enrollment);
                await _context.SaveChangesAsync();

                // Thông báo cho gia sư
                await _notificationService.CreateAsync(
                    userId: cls.TutorId,
                    title: "Học viên mới đăng ký",
                    message: $"{student.User.FullName} đã đăng ký lớp \"{cls.Title}\"",
                    type: "enrollment"
                );

                enrollment.Student = student;
                return new ApiResponse<ClassEnrollmentResponse>(
                    await BuildEnrollmentResponse(enrollment, cls, studentUserId),
                    "Đã gửi yêu cầu đăng ký lớp! Vui lòng chờ gia sư phê duyệt."
                );
            }
            catch (Exception ex)
            {
                return Fail<ClassEnrollmentResponse>("Lỗi khi đăng ký: " + ex.Message);
            }
        }

        // ============================================================
        // GET MY ENROLLMENTS
        // ============================================================
        public async Task<ApiResponse<List<ClassEnrollmentResponse>>> GetMyEnrollmentsAsync(int studentUserId)
        {
            try
            {
                var enrollments = await _context.ClassEnrollments
                    .Include(e => e.Class).ThenInclude(c => c.Subject)
                    .Include(e => e.Class).ThenInclude(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(e => e.Student).ThenInclude(s => s.User)
                    .Where(e => e.StudentId == studentUserId && (e.Status == EnrollmentStatus.Active || e.Status == EnrollmentStatus.Pending))
                    .OrderByDescending(e => e.EnrolledAt)
                    .ToListAsync();

                var result = new List<ClassEnrollmentResponse>();
                foreach (var e in enrollments)
                    result.Add(await BuildEnrollmentResponse(e, e.Class, studentUserId));

                return new ApiResponse<List<ClassEnrollmentResponse>>(result, "Lấy danh sách lớp thành công");
            }
            catch (Exception ex)
            {
                return Fail<List<ClassEnrollmentResponse>>("Lỗi: " + ex.Message);
            }
        }

        // ============================================================
        // GET TUTOR ENROLLMENTS
        // ============================================================
        public async Task<ApiResponse<List<ClassEnrollmentResponse>>> GetTutorEnrollmentsAsync(int tutorUserId)
        {
            try
            {
                var enrollments = await _context.ClassEnrollments
                    .Include(e => e.Class).ThenInclude(c => c.Subject)
                    .Include(e => e.Class).ThenInclude(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(e => e.Student).ThenInclude(s => s.User)
                    .Where(e => e.Class.TutorId == tutorUserId && (e.Status == EnrollmentStatus.Active || e.Status == EnrollmentStatus.Pending))
                    .OrderByDescending(e => e.EnrolledAt)
                    .ToListAsync();

                var result = new List<ClassEnrollmentResponse>();
                foreach (var e in enrollments)
                    result.Add(await BuildEnrollmentResponse(e, e.Class, e.StudentId));

                return new ApiResponse<List<ClassEnrollmentResponse>>(result, "Lấy danh sách học viên thành công");
            }
            catch (Exception ex)
            {
                return Fail<List<ClassEnrollmentResponse>>("Lỗi: " + ex.Message);
            }
        }

        // ============================================================
        // APPROVE ENROLLMENT
        // ============================================================
        public async Task<ApiResponse> ApproveEnrollmentAsync(int tutorUserId, int enrollmentId)
        {
            try
            {
                var enrollment = await _context.ClassEnrollments
                    .Include(e => e.Class).ThenInclude(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(e => e.Student).ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(e => e.Id == enrollmentId);

                if (enrollment == null) return new ApiResponse("Không tìm thấy yêu cầu", false);
                if (enrollment.Class.TutorId != tutorUserId) return new ApiResponse("Không có quyền duyệt yêu cầu này", false);
                if (enrollment.Status != EnrollmentStatus.Pending) return new ApiResponse("Yêu cầu không ở trạng thái chờ duyệt", false);
                if (enrollment.Class.CurrentStudents >= enrollment.Class.MaxStudents) return new ApiResponse("Lớp học đã đầy", false);

                enrollment.Status = EnrollmentStatus.Active;
                enrollment.Class.CurrentStudents++;

                await _context.SaveChangesAsync();

                // Gửi thông báo cho học viên
                await _notificationService.CreateAsync(
                    userId: enrollment.StudentId,
                    title: "Yêu cầu đăng ký được phê duyệt",
                    message: $"Gia sư {enrollment.Class.Tutor.User.FullName} đã duyệt bạn vào lớp \"{enrollment.Class.Title}\"",
                    type: "enrollment"
                );

                return new ApiResponse("Phê duyệt học viên thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }

        // ============================================================
        // REJECT ENROLLMENT
        // ============================================================
        public async Task<ApiResponse> RejectEnrollmentAsync(int tutorUserId, int enrollmentId)
        {
            try
            {
                var enrollment = await _context.ClassEnrollments
                    .Include(e => e.Class).ThenInclude(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(e => e.Student).ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(e => e.Id == enrollmentId);

                if (enrollment == null) return new ApiResponse("Không tìm thấy yêu cầu", false);
                if (enrollment.Class.TutorId != tutorUserId) return new ApiResponse("Không có quyền từ chối yêu cầu này", false);
                if (enrollment.Status != EnrollmentStatus.Pending) return new ApiResponse("Yêu cầu không ở trạng thái chờ duyệt", false);

                enrollment.Status = EnrollmentStatus.Rejected;

                await _context.SaveChangesAsync();

                // Gửi thông báo cho học viên
                await _notificationService.CreateAsync(
                    userId: enrollment.StudentId,
                    title: "Yêu cầu đăng ký bị từ chối",
                    message: $"Gia sư {enrollment.Class.Tutor.User.FullName} đã từ chối yêu cầu vào lớp \"{enrollment.Class.Title}\" của bạn.",
                    type: "enrollment"
                );

                return new ApiResponse("Từ chối học viên thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }

        // ============================================================
        // LEAVE CLASS – Xin nghỉ, xóa ngay, hoàn tiền
        // ============================================================
        public async Task<ApiResponse> LeaveClassAsync(int studentUserId, int enrollmentId)
        {
            try
            {
                var enrollment = await _context.ClassEnrollments
                    .Include(e => e.Class)
                    .FirstOrDefaultAsync(e => e.Id == enrollmentId);

                if (enrollment == null) return new ApiResponse("Không tìm thấy enrollment", false);
                if (enrollment.StudentId != studentUserId) return new ApiResponse("Bạn không có quyền thực hiện thao tác này", false);
                if (enrollment.Status != EnrollmentStatus.Active) return new ApiResponse("Enrollment không còn active", false);

                // Hủy tất cả session bookings pending/confirmed của học viên trong lớp này
                var sessions = await _context.Bookings
                    .Include(b => b.Class)
                    .Where(b =>
                        b.StudentId == studentUserId &&
                        b.ClassId == enrollment.ClassId &&
                        (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed))
                    .ToListAsync();

                foreach (var session in sessions)
                {
                    // Hoàn tiền
                    await _paymentService.RecordTransactionAsync(
                        studentUserId,
                        session.Class.PricePerSession,
                        TransactionType.Refund,
                        $"Hoàn tiền khi nghỉ lớp: {session.Class.Title}",
                        referenceId: session.Id.ToString()
                    );

                    // Thu hồi payout gia sư nếu đã payout (chỉ với Confirmed)
                    if (session.Status == BookingStatus.Confirmed)
                    {
                        var hasPayout = await _context.Transactions.AnyAsync(t =>
                            t.UserId == session.TutorId &&
                            t.Type == TransactionType.Earning &&
                            t.ReferenceId == session.Id.ToString() &&
                            t.Amount > 0);

                        if (hasPayout)
                        {
                            var clawback = Math.Round(session.Class.PricePerSession * TutorPayoutRate, 2, MidpointRounding.AwayFromZero);
                            await _paymentService.RecordTransactionAsync(
                                session.TutorId,
                                -clawback,
                                TransactionType.Earning,
                                $"Thu hồi payout (học viên nghỉ): {session.Class.Title}",
                                referenceId: session.Id.ToString()
                            );
                        }
                    }

                    session.Status = BookingStatus.Cancelled;
                }

                // Giảm CurrentStudents
                enrollment.Class.CurrentStudents = Math.Max(0, enrollment.Class.CurrentStudents - 1);
                enrollment.Status = EnrollmentStatus.Left;

                await _context.SaveChangesAsync();

                // Thông báo cho gia sư
                var student = await _context.Students.Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.UserId == studentUserId);
                await _notificationService.CreateAsync(
                    userId: enrollment.Class.TutorId,
                    title: "Học viên xin nghỉ",
                    message: $"{student?.User?.FullName ?? "Học viên"} đã rời khỏi lớp \"{enrollment.Class.Title}\"",
                    type: "enrollment"
                );

                return new ApiResponse("Đã rời khỏi lớp học thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }

        // ============================================================
        // REMOVE STUDENT – Gia sư xóa học viên khỏi lớp
        // ============================================================
        public async Task<ApiResponse> RemoveStudentAsync(int tutorUserId, int enrollmentId)
        {
            try
            {
                var enrollment = await _context.ClassEnrollments
                    .Include(e => e.Class).ThenInclude(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(e => e.Student).ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(e => e.Id == enrollmentId);

                if (enrollment == null) return new ApiResponse("Không tìm thấy enrollment", false);
                if (enrollment.Class.TutorId != tutorUserId) return new ApiResponse("Bạn không có quyền thực hiện thao tác này", false);
                if (enrollment.Status != EnrollmentStatus.Active) return new ApiResponse("Học viên không còn active trong lớp này", false);

                // Hủy và hoàn tiền các session pending/confirmed của học viên trong lớp
                var sessions = await _context.Bookings
                    .Include(b => b.Class)
                    .Where(b =>
                        b.StudentId == enrollment.StudentId &&
                        b.ClassId == enrollment.ClassId &&
                        (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed))
                    .ToListAsync();

                foreach (var session in sessions)
                {
                    // Hoàn tiền cho học viên
                    await _paymentService.RecordTransactionAsync(
                        enrollment.StudentId,
                        session.Class.PricePerSession,
                        TransactionType.Refund,
                        $"Hoàn tiền (gia sư xóa khỏi lớp): {session.Class.Title}",
                        referenceId: session.Id.ToString()
                    );

                    // Thu hồi payout gia sư nếu đã payout (Confirmed)
                    if (session.Status == BookingStatus.Confirmed)
                    {
                        var hasPayout = await _context.Transactions.AnyAsync(t =>
                            t.UserId == session.TutorId &&
                            t.Type == TransactionType.Earning &&
                            t.ReferenceId == session.Id.ToString() &&
                            t.Amount > 0);

                        if (hasPayout)
                        {
                            var clawback = Math.Round(session.Class.PricePerSession * TutorPayoutRate, 2, MidpointRounding.AwayFromZero);
                            await _paymentService.RecordTransactionAsync(
                                session.TutorId,
                                -clawback,
                                TransactionType.Earning,
                                $"Thu hồi payout (gia sư xóa học viên): {session.Class.Title}",
                                referenceId: session.Id.ToString()
                            );
                        }
                    }

                    session.Status = BookingStatus.Cancelled;
                }

                // Giảm CurrentStudents và cập nhật trạng thái
                enrollment.Class.CurrentStudents = Math.Max(0, enrollment.Class.CurrentStudents - 1);
                enrollment.Status = EnrollmentStatus.Left;

                await _context.SaveChangesAsync();

                // Thông báo cho học viên
                await _notificationService.CreateAsync(
                    userId: enrollment.StudentId,
                    title: "Bạn đã bị xóa khỏi lớp học",
                    message: $"Gia sư {enrollment.Class.Tutor?.User?.FullName ?? "gia sư"} đã xóa bạn khỏi lớp \"{enrollment.Class.Title}\". Tiền các buổi chưa học đã được hoàn lại.",
                    type: "enrollment"
                );

                return new ApiResponse("Đã xóa học viên khỏi lớp thành công", true);
            }
            catch (Exception ex)
            {
                return new ApiResponse("Lỗi: " + ex.Message, false);
            }
        }

        // ============================================================
        // SCHEDULE SESSION – Đặt buổi học cụ thể (trừ tiền)
        // ============================================================
        public async Task<ApiResponse<BookingResponse>> ScheduleSessionAsync(int studentUserId, ScheduleSessionRequest request)
        {
            try
            {
                var student = await _context.Students.Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.UserId == studentUserId);
                if (student == null) return Fail<BookingResponse>("Chỉ học sinh mới có thể đặt buổi học");

                var enrollment = await _context.ClassEnrollments.FirstOrDefaultAsync(e =>
                    e.StudentId == studentUserId && e.ClassId == request.ClassId && e.Status == EnrollmentStatus.Active);
                if (enrollment == null) return Fail<BookingResponse>("Bạn chưa phải là học viên chính thức của lớp học này");

                var cls = await _context.Classes
                    .Include(c => c.Tutor).ThenInclude(t => t.User)
                    .Include(c => c.Subject)
                    .FirstOrDefaultAsync(c => c.Id == request.ClassId);
                if (cls == null) return Fail<BookingResponse>("Lớp học không tồn tại");
                if (cls.Status != ClassStatus.Active) return Fail<BookingResponse>("Lớp học không còn hoạt động");

                // Kiểm tra startTime phải trong tương lai (ít nhất 1h)
                if (request.StartTime < DateTime.UtcNow.AddHours(1))
                    return Fail<BookingResponse>("Thời gian bắt đầu phải ít nhất 1 giờ sau thời điểm hiện tại");

                var endTime = request.StartTime.AddMinutes(cls.DurationInMinutes);

                // Kiểm tra giới hạn sessionsPerWeek
                var weekStart = request.StartTime.Date.AddDays(-(int)request.StartTime.DayOfWeek);
                var weekEnd = weekStart.AddDays(7);
                var sessionCountThisWeek = await _context.Bookings.CountAsync(b =>
                    b.StudentId == studentUserId &&
                    b.ClassId == request.ClassId &&
                    (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                    b.StartTime >= weekStart && b.StartTime < weekEnd);

                if (sessionCountThisWeek >= cls.SessionsPerWeek)
                    return Fail<BookingResponse>($"Bạn đã đặt tối đa {cls.SessionsPerWeek} buổi/tuần cho lớp này");

                // Kiểm tra trùng lịch học viên
                var studentBusy = await _context.Bookings.AnyAsync(b =>
                    b.StudentId == studentUserId &&
                    (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                    b.StartTime < endTime && b.EndTime > request.StartTime);
                if (studentBusy) return Fail<BookingResponse>("Bạn đã có lịch học khác trong khoảng thời gian này");

                // Kiểm tra trùng lịch gia sư
                var tutorBusy = await _context.Bookings.AnyAsync(b =>
                    b.TutorId == cls.TutorId &&
                    (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                    b.StartTime < endTime && b.EndTime > request.StartTime);
                if (tutorBusy) return Fail<BookingResponse>("Gia sư đã có lịch dạy khác trong khoảng thời gian này");

                // Kiểm tra số dư
                if (student.User.Balance < cls.PricePerSession)
                    return Fail<BookingResponse>($"Số dư không đủ. Cần {cls.PricePerSession:N0} VNĐ, hiện có {student.User.Balance:N0} VNĐ");

                // Tạo session booking
                var booking = new Booking
                {
                    StudentId = studentUserId,
                    TutorId = cls.TutorId,
                    ClassId = cls.Id,
                    BookingDate = DateTime.UtcNow,
                    StartTime = request.StartTime,
                    EndTime = endTime,
                    Status = BookingStatus.Pending,
                    Note = request.Note
                };

                // Trừ tiền học viên
                await _paymentService.RecordTransactionAsync(
                    studentUserId,
                    -cls.PricePerSession,
                    TransactionType.BookingPay,
                    $"Thanh toán buổi học: {cls.Title}",
                    referenceId: cls.Id.ToString()
                );

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                // Thông báo gia sư
                await _notificationService.CreateAsync(
                    userId: cls.TutorId,
                    title: "Buổi học mới",
                    message: $"{student.User.FullName} đã đặt buổi học lớp \"{cls.Title}\" lúc {request.StartTime.ToLocalTime():dd/MM/yyyy HH:mm}",
                    type: "booking"
                );

                // Reload để trả về đầy đủ thông tin
                var created = await _context.Bookings
                    .Include(b => b.Class).ThenInclude(c => c.Subject)
                    .Include(b => b.Tutor).ThenInclude(t => t.User)
                    .Include(b => b.Student).ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(b => b.Id == booking.Id);

                return new ApiResponse<BookingResponse>(MapBookingToResponse(created!), "Đặt buổi học thành công! Chờ gia sư xác nhận.");
            }
            catch (Exception ex)
            {
                return Fail<BookingResponse>("Lỗi khi đặt buổi học: " + ex.Message);
            }
        }

        // ============================================================
        // GET AVAILABLE SLOTS
        // ============================================================
        public async Task<ApiResponse<List<AvailableSlotResponse>>> GetAvailableSlotsAsync(int classId, DateTime weekStart)
        {
            try
            {
                var cls = await _context.Classes.Include(c => c.Tutor)
                    .FirstOrDefaultAsync(c => c.Id == classId);
                if (cls == null) return Fail<List<AvailableSlotResponse>>("Lớp học không tồn tại");

                var weekEnd = weekStart.Date.AddDays(7);
                var tutorId = cls.TutorId;
                var duration = cls.DurationInMinutes;

                // Lấy tất cả booking của tutor trong tuần
                var busySlots = await _context.Bookings
                    .Where(b => b.TutorId == tutorId &&
                                (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                                b.StartTime >= weekStart && b.StartTime < weekEnd)
                    .Select(b => new { b.StartTime, b.EndTime })
                    .ToListAsync();

                // Lấy availability đã khai báo của gia sư
                var declaredAvailability = await _context.TutorAvailabilities
                    .Where(a => a.TutorId == tutorId)
                    .ToListAsync();

                var slots = new List<AvailableSlotResponse>();

                for (int day = 0; day < 7; day++)
                {
                    var date = weekStart.Date.AddDays(day);
                    var dayOfWeek = date.DayOfWeek;

                    // Xác định khung giờ làm việc cho ngày này
                    List<(TimeSpan start, TimeSpan end)> workingRanges;

                    if (declaredAvailability.Any())
                    {
                        // Dùng lịch gia sư đã khai báo
                        workingRanges = declaredAvailability
                            .Where(a => a.DayOfWeek == dayOfWeek)
                            .Select(a => (a.StartTime, a.EndTime))
                            .ToList();
                    }
                    else
                    {
                        // Mặc định: 7h–22h
                        workingRanges = new List<(TimeSpan, TimeSpan)>
                        {
                            (new TimeSpan(7, 0, 0), new TimeSpan(22, 0, 0))
                        };
                    }

                    foreach (var (rangeStart, rangeEnd) in workingRanges)
                    {
                        var current = date.Add(rangeStart);
                        var rangeEndDt = date.Add(rangeEnd);

                        while (current.AddMinutes(duration) <= rangeEndDt)
                        {
                            var slotEnd = current.AddMinutes(duration);
                            var currentLocal = DateTime.SpecifyKind(current, DateTimeKind.Local);
                            var slotEndLocal = DateTime.SpecifyKind(slotEnd, DateTimeKind.Local);
                            var currentUtc = currentLocal.ToUniversalTime();
                            var slotEndUtc = slotEndLocal.ToUniversalTime();

                            // Chỉ show slot trong tương lai (ít nhất 1h từ bây giờ)
                            if (currentUtc > DateTime.UtcNow.AddHours(1))
                            {
                                // Kiểm tra xem slot này có bị trùng không (so sánh bằng giờ UTC)
                                bool isBusy = busySlots.Any(b =>
                                    b.StartTime < slotEndUtc && b.EndTime > currentUtc);

                                if (!isBusy)
                                {
                                    slots.Add(new AvailableSlotResponse
                                    {
                                        StartTime = currentUtc,
                                        EndTime = slotEndUtc,
                                        IsAvailable = true
                                    });
                                }
                            }

                            current = current.AddMinutes(60);
                        }
                    }
                }

                return new ApiResponse<List<AvailableSlotResponse>>(slots, "Lấy lịch rảnh thành công");
            }
            catch (Exception ex)
            {
                return Fail<List<AvailableSlotResponse>>("Lỗi: " + ex.Message);
            }
        }

        // ============================================================
        // HELPERS
        // ============================================================
        private async Task<ClassEnrollmentResponse> BuildEnrollmentResponse(ClassEnrollment e, Class cls, int studentUserId)
        {
            var now = DateTime.UtcNow;
            var rating = await _context.Reviews
                .Where(r => r.TutorId == cls.TutorId)
                .AverageAsync(r => (double?)r.Rating) ?? 0;

            var next = await _context.Bookings
                .Where(b => b.StudentId == studentUserId && b.ClassId == cls.Id &&
                            (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                            b.StartTime > now)
                .OrderBy(b => b.StartTime)
                .Select(b => (DateTime?)b.StartTime)
                .FirstOrDefaultAsync();

            var weekStart = now.Date.AddDays(-(int)now.DayOfWeek);
            var weekEnd = weekStart.AddDays(7);
            var sessionsThisWeek = await _context.Bookings.CountAsync(b =>
                b.StudentId == studentUserId && b.ClassId == cls.Id &&
                (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
                b.StartTime >= weekStart && b.StartTime < weekEnd);

            return new ClassEnrollmentResponse
            {
                EnrollmentId = e.Id,
                ClassId = cls.Id,
                ClassTitle = cls.Title,
                SubjectName = cls.Subject?.Name ?? "",
                Grade = cls.GradeLevel,
                TutorUserId = cls.TutorId,
                TutorName = cls.Tutor?.User?.FullName ?? "",
                TutorAvatar = cls.Tutor?.User?.AvatarUrl ?? "",
                City = cls.Tutor?.User?.Address ?? "",
                TutorRating = Math.Round(rating, 1),
                PricePerSession = cls.PricePerSession,
                DurationMinutes = cls.DurationInMinutes,
                SessionsPerWeek = cls.SessionsPerWeek,
                EnrolledAt = DateTime.SpecifyKind(e.EnrolledAt, DateTimeKind.Utc),
                Status = e.Status,
                NextSessionTime = next.HasValue
                    ? DateTime.SpecifyKind(next.Value, DateTimeKind.Utc).ToLocalTime().ToString("dd/MM/yyyy HH:mm")
                    : null,
                SessionsBookedThisWeek = sessionsThisWeek,
                StudentUserId = e.StudentId,
                StudentName = e.Student?.User?.FullName ?? "",
                StudentAvatar = e.Student?.User?.AvatarUrl ?? ""
            };
        }

        private BookingResponse MapBookingToResponse(Booking b)
        {
            var (statusText, statusColor) = b.Status switch
            {
                BookingStatus.Pending => ("⏳ Chờ xác nhận", "warning"),
                BookingStatus.Confirmed => ("✅ Đã xác nhận", "success"),
                BookingStatus.Completed => ("🎓 Hoàn thành", "info"),
                BookingStatus.Cancelled => ("❌ Đã hủy", "danger"),
                _ => ("Unknown", "secondary")
            };

            return new BookingResponse
            {
                Id = b.Id,
                StudentUserId = b.StudentId,
                StudentName = b.Student?.User?.FullName ?? "",
                StudentAvatar = b.Student?.User?.AvatarUrl,
                TutorUserId = b.TutorId,
                TutorName = b.Tutor?.User?.FullName ?? "",
                TutorAvatar = b.Tutor?.User?.AvatarUrl,
                ClassId = b.ClassId,
                ClassTitle = b.Class?.Title ?? "",
                SubjectName = b.Class?.Subject?.Name ?? "",
                PricePerSession = b.Class?.PricePerSession ?? 0,
                DurationMinutes = b.Class?.DurationInMinutes ?? 0,
                BookingDate = DateTime.SpecifyKind(b.BookingDate, DateTimeKind.Utc),
                StartTime = DateTime.SpecifyKind(b.StartTime, DateTimeKind.Utc),
                EndTime = DateTime.SpecifyKind(b.EndTime, DateTimeKind.Utc),
                Note = b.Note,
                Status = b.Status,
                StatusText = statusText,
                StatusColor = statusColor
            };
        }

        private ApiResponse<T> Fail<T>(string msg) =>
            new ApiResponse<T>(msg, new List<string> { msg });
    }
}
