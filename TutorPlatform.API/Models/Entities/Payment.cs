using System;
using System.ComponentModel.DataAnnotations.Schema;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    public class Payment
    {
        public int Id { get; set; }

        // Liên kết với Booking
        public int BookingId { get; set; }

        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string TransactionId { get; set; } = string.Empty; // Mã giao dịch từ cổng thanh toán (VNPAY, Momo...)
        public string PaymentMethod { get; set; } = string.Empty;

        // Sử dụng Enum PaymentStatus
        public PaymentStatus Status { get; set; }

        // Navigation Property
        public Booking Booking { get; set; }
    }
}