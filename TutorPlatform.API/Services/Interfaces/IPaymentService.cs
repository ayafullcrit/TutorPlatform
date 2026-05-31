using TutorPlatform.API.Models.DTOs.Requests.Payment;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Payment;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<ApiResponse<TransactionResponse>> TopUpAsync(int userId, TopUpRequest request);
        Task<ApiResponse<WalletSummary>> GetWalletAsync(int userId);
        Task<ApiResponse<List<TransactionResponse>>> GetTransactionHistoryAsync(int userId, int page = 1, int pageSize = 20);
        Task<ApiResponse<List<TransactionResponse>>> GetAdminTransactionsAsync();
        Task<ApiResponse<List<TransactionResponse>>> GetAdminWithdrawalRequestsAsync();
        Task<ApiResponse<TransactionResponse>> ApproveWithdrawalAsync(int transactionId);
        Task<ApiResponse<TransactionResponse>> RejectWithdrawalAsync(int transactionId);
        Task<ApiResponse<int>> ApproveAllPendingWithdrawalsAsync();
        Task<Transaction> RecordTransactionAsync(int userId, decimal amount, TutorPlatform.API.Models.Enums.TransactionType type, string description, string? referenceId = null);
        Task<ApiResponse<TransactionResponse>> WithdrawAsync(int userId, decimal amount);
    }
}
