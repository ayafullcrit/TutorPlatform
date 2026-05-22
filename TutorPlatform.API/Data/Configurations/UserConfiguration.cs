using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(u => u.Id);

            // Properties
            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(u => u.FullName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(u => u.PhoneNumber)
                .HasMaxLength(20);

            builder.Property(u => u.AvatarUrl)
                .HasMaxLength(500);

            builder.Property(u => u.Address)
                .HasMaxLength(500);

            builder.Property(u => u.Role)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(u => u.IsActivated)
                .HasDefaultValue(true);

            builder.Property(u => u.Balance)
                .IsRequired()
                .HasPrecision(18, 2)
                .HasDefaultValue(0);

            // Indexes
            builder.HasIndex(u => u.Email)
                .IsUnique();

            builder.HasIndex(u => u.Role);
            builder.HasIndex(u => u.IsActivated);

            // ============================================
            // RELATIONSHIPS (ONE-TO-ONE)
            // ============================================

            // User → Student
            builder.HasOne(u => u.Student)
              .WithOne(s => s.User)
              .HasForeignKey<Student>(s => s.UserId)  // ✅ UserId trong Student
              .OnDelete(DeleteBehavior.Cascade);

            // User → Tutor
            builder.HasOne(u => u.Tutor)
                .WithOne(t => t.User)
                .HasForeignKey<Tutor>(t => t.UserId)  // ✅ UserId trong Tutor
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}