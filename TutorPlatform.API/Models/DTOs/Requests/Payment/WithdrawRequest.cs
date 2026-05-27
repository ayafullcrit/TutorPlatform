using System.ComponentModel.DataAnnotations;

namespace TutorPlatform.API.Models.DTOs.Requests.Payment
{
    public class WithdrawRequest
    {
        [Required]
        [Range(10000, 50000000, ErrorMessage = "Số tiền rút phải từ 10,000 đến 50,000,000 VNĐ")]
        public decimal Amount { get; set; }
    }
}
