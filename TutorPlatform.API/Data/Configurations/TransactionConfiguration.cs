using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.Configurations
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.ToTable("Transactions");
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(t => t.BalanceBefore)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(t => t.BalanceAfter)
                .HasPrecision(18, 2)
                .IsRequired();

            builder.Property(t => t.Type)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(t => t.Description)
                .HasMaxLength(500);

            builder.Property(t => t.ReferenceId)
                .HasMaxLength(100)
                .IsRequired(false);

            builder.Property(t => t.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()")
                .ValueGeneratedOnAdd();

            // Indexes
            builder.HasIndex(t => t.UserId);
            builder.HasIndex(t => t.CreatedAt);
            builder.HasIndex(t => t.Type);

            // Relationship
            builder.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}