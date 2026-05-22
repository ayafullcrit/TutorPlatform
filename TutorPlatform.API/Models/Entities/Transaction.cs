using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Models.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }         
        public decimal BalanceBefore { get; set; }
        public decimal BalanceAfter { get; set; }
        public TransactionType Type { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? ReferenceId { get; set; }    
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User User { get; set; }
    }
}