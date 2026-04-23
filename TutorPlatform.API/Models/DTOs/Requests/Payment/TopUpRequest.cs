using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Payment
{
    public class TopUpRequest
    {
        [Required]
        [Range(10000, 50000000, ErrorMessage = "Số tiền nạp phải từ 10,000 đến 50,000,000 VNĐ")]
        public decimal Amount { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = "Mock"; // Mock, VNPay, Momo
    }
}