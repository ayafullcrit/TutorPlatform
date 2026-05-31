using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Data;
using TutorPlatform.API.Models.DTOs.Requests.Payment;
using TutorPlatform.API.Models.DTOs.Responses;
using TutorPlatform.API.Models.DTOs.Responses.Payment;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using TutorPlatform.API.Services.Interfaces;

namespace TutorPlatform.API.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<TransactionResponse>> TopUpAsync(int userId, TopUpRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return Fail<TransactionResponse>("Người dùng không tồn tại");

                await Task.Delay(300);

                var tx = await RecordTransactionAsync(
                    userId,
                    request.Amount,
                    TransactionType.TopUp,
                    $"Nạp tiền qua {request.PaymentMethod}",
                    referenceId: $"TOPUP-{Guid.NewGuid().ToString("N")[..8].ToUpper()}"
                );

                return new ApiResponse<TransactionResponse>(
                    MapToResponse(tx),
                    $"Nạp {FormatVnd(request.Amount)} thành công! Số dư mới: {FormatVnd(tx.BalanceAfter)}"
                );
            }
            catch (Exception ex)
            {
                return Fail<TransactionResponse>("Lỗi nạp tiền: " + ex.Message);
            }
        }

        public async Task<ApiResponse<WalletSummary>> GetWalletAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return Fail<WalletSummary>("Người dùng không tồn tại");

                var transactions = await _context.Transactions
                    .Where(t => t.UserId == userId)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                var summary = new WalletSummary
                {
                    Balance = user.Balance,
                    TotalTopUp = transactions.Where(t => t.Type == TransactionType.TopUp).Sum(t => t.Amount),
                    TotalSpent = Math.Abs(transactions.Where(t => t.Type == TransactionType.BookingPay).Sum(t => t.Amount)),
                    TotalEarned = transactions.Where(t => t.Type == TransactionType.Earning).Sum(t => t.Amount),
                    TotalWithdrawn = Math.Abs(transactions
                        .Where(t => t.Type == TransactionType.Withdrawal && t.WithdrawalStatus == WithdrawalRequestStatus.Approved)
                        .Sum(t => t.Amount)),
                    RecentTransactions = transactions.Take(10).Select(MapToResponse).ToList()
                };

                return new ApiResponse<WalletSummary>(summary, "Lấy thông tin ví thành công");
            }
            catch (Exception ex)
            {
                return Fail<WalletSummary>("Lỗi: " + ex.Message);
            }
        }

        public async Task<ApiResponse<List<TransactionResponse>>> GetTransactionHistoryAsync(int userId, int page = 1, int pageSize = 20)
        {
            try
            {
                var transactions = await _context.Transactions
                    .Where(t => t.UserId == userId)
                    .OrderByDescending(t => t.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new ApiResponse<List<TransactionResponse>>(
                    transactions.Select(MapToResponse).ToList(),
                    "Lấy lịch sử giao dịch thành công"
                );
            }
            catch (Exception ex)
            {
                return Fail<List<TransactionResponse>>("Lỗi: " + ex.Message);
            }
        }

        public async Task<ApiResponse<List<TransactionResponse>>> GetAdminTransactionsAsync()
        {
            try
            {
                var transactions = await _context.Transactions
                    .Include(t => t.User)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                var response = transactions.Select(tx =>
                {
                    var resp = MapToResponse(tx);
                    resp.TutorName = tx.User?.FullName ?? "N/A";
                    resp.BankInfo = tx.User != null ? $"Vietcombank - {tx.User.PhoneNumber}" : "N/A";
                    resp.Status = tx.Type == TransactionType.Withdrawal
                        ? tx.WithdrawalStatus.ToString().ToLowerInvariant()
                        : "completed";
                    return resp;
                }).ToList();

                return new ApiResponse<List<TransactionResponse>>(response, "Lấy danh sách giao dịch hệ thống thành công");
            }
            catch (Exception ex)
            {
                return Fail<List<TransactionResponse>>("Lỗi: " + ex.Message);
            }
        }

        public async Task<ApiResponse<List<TransactionResponse>>> GetAdminWithdrawalRequestsAsync()
        {
            var result = await GetAdminTransactionsAsync();
            var withdrawals = result.Data?.Where(t => t.Type == (int)TransactionType.Withdrawal && t.Status == "pending").ToList()
                              ?? new List<TransactionResponse>();
            return new ApiResponse<List<TransactionResponse>>(withdrawals, "Lấy danh sách rút tiền thành công");
        }

        public async Task<ApiResponse<TransactionResponse>> ApproveWithdrawalAsync(int transactionId)
        {
            var tx = await _context.Transactions.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == transactionId);
            if (tx == null) return Fail<TransactionResponse>("Giao dịch không tồn tại");
            if (tx.Type != TransactionType.Withdrawal) return Fail<TransactionResponse>("Giao dịch không phải rút tiền");
            if (tx.WithdrawalStatus != WithdrawalRequestStatus.Pending)
                return new ApiResponse<TransactionResponse>(MapToResponse(tx), "Giao dịch đã được xử lý trước đó");

            var withdrawalAmount = Math.Abs(tx.Amount);
            var balanceBefore = tx.User.Balance;
            if (balanceBefore < withdrawalAmount)
                return Fail<TransactionResponse>("Số dư không đủ để duyệt rút tiền");

            tx.User.Balance -= withdrawalAmount;
            tx.BalanceBefore = balanceBefore;
            tx.BalanceAfter = tx.User.Balance;
            tx.WithdrawalStatus = WithdrawalRequestStatus.Approved;
            tx.Description = $"{tx.Description} - Đã duyệt";

            await _context.SaveChangesAsync();

            var resp = MapToResponse(tx);
            resp.Status = "completed";
            return new ApiResponse<TransactionResponse>(resp, "Duyệt rút tiền thành công");
        }

        public async Task<ApiResponse<TransactionResponse>> RejectWithdrawalAsync(int transactionId)
        {
            var tx = await _context.Transactions.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == transactionId);
            if (tx == null) return Fail<TransactionResponse>("Giao dịch không tồn tại");
            if (tx.Type != TransactionType.Withdrawal) return Fail<TransactionResponse>("Giao dịch không phải rút tiền");
            if (tx.WithdrawalStatus != WithdrawalRequestStatus.Pending)
                return new ApiResponse<TransactionResponse>(MapToResponse(tx), "Giao dịch đã được xử lý trước đó");

            tx.WithdrawalStatus = WithdrawalRequestStatus.Rejected;
            tx.Description = $"{tx.Description} - Từ chối";

            await _context.SaveChangesAsync();

            var resp = MapToResponse(tx);
            resp.Status = "rejected";
            return new ApiResponse<TransactionResponse>(resp, "Từ chối rút tiền thành công");
        }

        public async Task<ApiResponse<int>> ApproveAllPendingWithdrawalsAsync()
        {
            var pending = await _context.Transactions
                .Include(t => t.User)
                .Where(t => t.Type == TransactionType.Withdrawal && t.WithdrawalStatus == WithdrawalRequestStatus.Pending)
                .ToListAsync();

            var count = 0;
            foreach (var tx in pending)
            {
                var withdrawalAmount = Math.Abs(tx.Amount);
                var balanceBefore = tx.User.Balance;
                if (balanceBefore < withdrawalAmount)
                    continue;

                tx.User.Balance -= withdrawalAmount;
                tx.BalanceBefore = balanceBefore;
                tx.BalanceAfter = tx.User.Balance;
                tx.Description = $"{tx.Description} - Đã duyệt";
                tx.WithdrawalStatus = WithdrawalRequestStatus.Approved;
                count++;
            }

            await _context.SaveChangesAsync();
            return new ApiResponse<int>(count, $"Đã duyệt {count} giao dịch chờ xử lý");
        }

        public async Task<Transaction> RecordTransactionAsync(int userId, decimal amount, TransactionType type, string description, string? referenceId = null)
        {
            var user = await _context.Users.FindAsync(userId)
                ?? throw new Exception($"User {userId} không tồn tại");

            var balanceBefore = user.Balance;
            if (type != TransactionType.Withdrawal)
            {
                user.Balance += amount;
            }

            var tx = new Transaction
            {
                UserId = userId,
                Amount = amount,
                BalanceBefore = balanceBefore,
                BalanceAfter = type == TransactionType.Withdrawal ? balanceBefore : user.Balance,
                Type = type,
                Description = description,
                ReferenceId = referenceId,
                WithdrawalStatus = type == TransactionType.Withdrawal ? WithdrawalRequestStatus.Pending : WithdrawalRequestStatus.Approved,
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(tx);
            await _context.SaveChangesAsync();
            return tx;
        }

        public async Task<ApiResponse<TransactionResponse>> WithdrawAsync(int userId, decimal amount)
        {
            try
            {
                if (amount <= 0)
                    return Fail<TransactionResponse>("Số tiền rút phải lớn hơn 0");

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return Fail<TransactionResponse>("Người dùng không tồn tại");

                if (user.Balance < amount)
                    return Fail<TransactionResponse>("Số dư tài khoản không đủ để thực hiện giao dịch này");

                var tx = await RecordTransactionAsync(
                    userId,
                    -amount,
                    TransactionType.Withdrawal,
                    "Yêu cầu rút tiền về tài khoản ngân hàng",
                    referenceId: $"WITHDRAW-{Guid.NewGuid().ToString("N")[..8].ToUpper()}"
                );

                return new ApiResponse<TransactionResponse>(
                    MapToResponse(tx),
                    "Yêu cầu rút tiền đã được gửi và đang chờ admin xác nhận"
                );
            }
            catch (Exception ex)
            {
                return Fail<TransactionResponse>("Lỗi rút tiền: " + ex.Message);
            }
        }

        private TransactionResponse MapToResponse(Transaction tx)
        {
            var (typeText, typeIcon, typeColor) = tx.Type switch
            {
                TransactionType.TopUp => ("Nạp tiền", "+", "success"),
                TransactionType.BookingPay => ("Thanh toán lịch học", "-", "danger"),
                TransactionType.Refund => ("Hoàn tiền", "+", "info"),
                TransactionType.Earning => ("Thu nhập", "+", "success"),
                TransactionType.Withdrawal => ("Rút tiền", "-", "warning"),
                _ => ("Giao dịch", " ", "secondary")
            };

            var sign = tx.Amount >= 0 ? "+" : "";

            return new TransactionResponse
            {
                Id = tx.Id,
                Amount = tx.Amount,
                BalanceBefore = tx.BalanceBefore,
                BalanceAfter = tx.BalanceAfter,
                Type = (int)tx.Type,
                TypeText = typeText,
                TypeIcon = typeIcon,
                TypeColor = typeColor,
                Description = tx.Description,
                ReferenceId = tx.ReferenceId,
                CreatedAt = tx.CreatedAt,
                TimeAgo = GetTimeAgo(tx.CreatedAt),
                FormattedAmount = $"{sign}{FormatVnd(Math.Abs(tx.Amount))}",
                Status = tx.Type == TransactionType.Withdrawal
                    ? tx.WithdrawalStatus.ToString().ToLowerInvariant()
                    : "completed"
            };
        }

        private static string FormatVnd(decimal amount) => $"{amount:N0} VNĐ";

        private static string GetTimeAgo(DateTime dt)
        {
            var diff = DateTime.UtcNow - dt;
            if (diff.TotalMinutes < 1) return "vừa xong";
            if (diff.TotalHours < 1) return $"{(int)diff.TotalMinutes} phút trước";
            if (diff.TotalDays < 1) return $"{(int)diff.TotalHours} giờ trước";
            if (diff.TotalDays < 30) return $"{(int)diff.TotalDays} ngày trước";
            if (diff.TotalDays < 365) return $"{(int)(diff.TotalDays / 30)} tháng trước";
            return $"{(int)(diff.TotalDays / 365)} năm trước";
        }

        private static ApiResponse<T> Fail<T>(string msg) =>
            new ApiResponse<T>(msg, new List<string> { msg });
    }
}
