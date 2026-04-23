using TutorPlatform.API.Models.DTOs.Requests.Payment;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Payment;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface IPaymentService
    {
        // Nạp tiền vào ví (mock — tự động thành công)
        Task<ApiResponse<TransactionResponse>> TopUpAsync(int userId, TopUpRequest request);

        // Lấy thông tin ví + lịch sử giao dịch gần đây
        Task<ApiResponse<WalletSummary>> GetWalletAsync(int userId);

        // Lấy toàn bộ lịch sử giao dịch (có phân trang)
        Task<ApiResponse<List<TransactionResponse>>> GetTransactionHistoryAsync(
            int userId, int page = 1, int pageSize = 20);

        // Ghi nhận giao dịch nội bộ (dùng bởi BookingService, ReviewService)
        Task<Transaction> RecordTransactionAsync(
            int userId,
            decimal amount,
            TutorPlatform.API.Models.Enums.TransactionType type,
            string description,
            string? referenceId = null);
    }
}