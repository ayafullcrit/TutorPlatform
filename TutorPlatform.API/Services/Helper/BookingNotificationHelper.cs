// ================================================================
// BOOKING NOTIFICATIONS — inject vào BookingService
// ================================================================
// Thêm INotificationService vào constructor BookingService:
//
//   private readonly INotificationService _notificationService;
//
//   public BookingService(ApplicationDbContext context,
//       INotificationService notificationService)
//   {
//       _context = context;
//       _notificationService = notificationService;
//   }
//
// Sau đó gọi các helper dưới đây tại đúng thời điểm:
// ================================================================

using System.Text.Json;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Helpers
{
    /// <summary>
    /// Tập hợp các notification trigger cho Booking flow.
    /// Gọi từ BookingService sau khi SaveChangesAsync() thành công.
    /// </summary>
    public static class BookingNotifications
    {
        // ----------------------------------------------------------------
        // Gọi trong: CreateBookingAsync — sau khi tạo booking thành công
        // ----------------------------------------------------------------
        public static async Task OnBookingCreated(
            INotificationService svc,
            int tutorUserId,
            int studentUserId,
            int bookingId,
            string studentName,
            string classTitle)
        {
            var relatedData = JsonSerializer.Serialize(new { bookingId, route = "/my-bookings" });

            // Thông báo cho Tutor: có booking mới cần xác nhận
            await svc.CreateAsync(
                userId: tutorUserId,
                title: "Có lịch đặt mới!",
                message: $"{studentName} vừa đặt lớp \"{classTitle}\". Hãy xác nhận sớm.",
                type: "Booking",
                relatedData: relatedData
            );

            // Thông báo cho Student: đặt thành công, chờ xác nhận
            await svc.CreateAsync(
                userId: studentUserId,
                title: "Đặt lịch thành công",
                message: $"Lớp \"{classTitle}\" đã được đặt. Vui lòng chờ gia sư xác nhận.",
                type: "Booking",
                relatedData: relatedData
            );
        }

        // ----------------------------------------------------------------
        // Gọi trong: ConfirmBookingAsync — sau khi tutor xác nhận
        // ----------------------------------------------------------------
        public static async Task OnBookingConfirmed(
            INotificationService svc,
            int studentUserId,
            int bookingId,
            string tutorName,
            string classTitle)
        {
            var relatedData = JsonSerializer.Serialize(new { bookingId, route = "/my-bookings" });

            await svc.CreateAsync(
                userId: studentUserId,
                title: "Lịch học đã được xác nhận! ✅",
                message: $"Gia sư {tutorName} đã xác nhận lớp \"{classTitle}\". Chuẩn bị học thôi!",
                type: "Booking",
                relatedData: relatedData
            );
        }

        // ----------------------------------------------------------------
        // Gọi trong: CompleteBookingAsync — sau khi tutor đánh dấu hoàn thành
        // ----------------------------------------------------------------
        public static async Task OnBookingCompleted(
            INotificationService svc,
            int studentUserId,
            int tutorUserId,
            int bookingId,
            string classTitle,
            decimal tutorEarning)
        {
            var relatedData = JsonSerializer.Serialize(new { bookingId, route = "/my-bookings" });

            // Nhắc student để lại đánh giá
            await svc.CreateAsync(
                userId: studentUserId,
                title: "Buổi học hoàn thành! Hãy đánh giá nhé ⭐",
                message: $"Lớp \"{classTitle}\" đã kết thúc. Chia sẻ trải nghiệm của bạn để giúp gia sư nhé!",
                type: "Review",
                relatedData: JsonSerializer.Serialize(new { bookingId, route = "/my-bookings" })
            );

            // Thông báo thu nhập cho Tutor
            await svc.CreateAsync(
                userId: tutorUserId,
                title: "Bạn vừa nhận được thu nhập 💰",
                message: $"+{tutorEarning:N0} VNĐ từ lớp \"{classTitle}\" đã vào ví của bạn.",
                type: "Payment",
                relatedData: JsonSerializer.Serialize(new { route = "/wallet" })
            );
        }

        // ----------------------------------------------------------------
        // Gọi trong: CancelBookingByStudentAsync
        // ----------------------------------------------------------------
        public static async Task OnBookingCancelledByStudent(
            INotificationService svc,
            int tutorUserId,
            int studentUserId,
            int bookingId,
            string studentName,
            string classTitle,
            decimal refundAmount)
        {
            var relatedData = JsonSerializer.Serialize(new { bookingId, route = "/my-bookings" });

            // Thông báo cho Tutor
            await svc.CreateAsync(
                userId: tutorUserId,
                title: "Học sinh đã hủy lịch",
                message: $"{studentName} đã hủy lớp \"{classTitle}\".",
                type: "Booking",
                relatedData: relatedData
            );

            // Thông báo hoàn tiền cho Student
            await svc.CreateAsync(
                userId: studentUserId,
                title: "Hoàn tiền thành công",
                message: $"Đã hoàn {refundAmount:N0} VNĐ vào ví của bạn sau khi hủy lớp \"{classTitle}\".",
                type: "Payment",
                relatedData: JsonSerializer.Serialize(new { route = "/wallet" })
            );
        }

        // ----------------------------------------------------------------
        // Gọi trong: CancelBookingByTutorAsync
        // ----------------------------------------------------------------
        public static async Task OnBookingCancelledByTutor(
            INotificationService svc,
            int studentUserId,
            int bookingId,
            string tutorName,
            string classTitle,
            decimal refundAmount)
        {
            var relatedData = JsonSerializer.Serialize(new { bookingId, route = "/my-bookings" });

            await svc.CreateAsync(
                userId: studentUserId,
                title: "Gia sư đã hủy lịch",
                message: $"Gia sư {tutorName} đã hủy lớp \"{classTitle}\". Bạn được hoàn {refundAmount:N0} VNĐ.",
                type: "Booking",
                relatedData: relatedData
            );
        }

        // ----------------------------------------------------------------
        // Gọi trong: TopUpAsync (PaymentService) — sau khi nạp tiền xong
        // ----------------------------------------------------------------
        public static async Task OnTopUp(
            INotificationService svc,
            int userId,
            decimal amount,
            decimal newBalance)
        {
            await svc.CreateAsync(
                userId: userId,
                title: "Nạp tiền thành công 💳",
                message: $"Ví của bạn đã được cộng {amount:N0} VNĐ. Số dư hiện tại: {newBalance:N0} VNĐ.",
                type: "Payment",
                relatedData: System.Text.Json.JsonSerializer.Serialize(new { route = "/wallet" })
            );
        }
    }
}