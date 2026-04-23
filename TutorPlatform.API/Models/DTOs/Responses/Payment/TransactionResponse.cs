namespace TutorPlatform.API.Models.DTOs.Responses.Payment
{
    public class TransactionResponse
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public decimal BalanceBefore { get; set; }
        public decimal BalanceAfter { get; set; }
        public int Type { get; set; }             // enum as int
        public string TypeText { get; set; }      // "Nạp tiền", "Thanh toán"...
        public string TypeIcon { get; set; }      // "+", "-"
        public string TypeColor { get; set; }     // "success", "danger", "info"
        public string Description { get; set; }
        public string? ReferenceId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string TimeAgo { get; set; }
        public string FormattedAmount { get; set; }  // "+150,000 VNĐ"
    }

    public class WalletSummary
    {
        public decimal Balance { get; set; }
        public decimal TotalTopUp { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal TotalEarned { get; set; }
        public List<TransactionResponse> RecentTransactions { get; set; }
    }
}