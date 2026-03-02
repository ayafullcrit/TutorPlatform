using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TutorPlatform.API.Data.Configurations
{
    public class UserConfiguration :  IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(u => u.Id);
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

            // Role (Enum → INT)
            builder.Property(u => u.Role)
                .IsRequired()
                .HasConversion<int>(); // Convert enum to int
                       
            // Email phải unique
            builder.HasIndex(u => u.Email)
                .IsUnique();

            // Index cho Role (query nhanh)
            builder.HasIndex(u => u.Role);

            // Index cho IsActive
            builder.HasIndex(u => u.IsActivated);
                     
            // User → Student (One-to-One)
            builder.HasOne(u => u.Student)
                .WithOne(s => s.User)
                .HasForeignKey<Student>(s => s.Id)
                .OnDelete(DeleteBehavior.Cascade); // Xóa User → xóa Student

            // User → Tutor (One-to-One)
            builder.HasOne(u => u.Tutor)
                .WithOne(t => t.User)
                .HasForeignKey<Tutor>(t => t.Id)
                .OnDelete(DeleteBehavior.Cascade);

            //// User → Messages (One-to-Many - Sent)
            //builder.HasMany(u => u.SentMessages)
            //    .WithOne(m => m.Sender)
            //    .HasForeignKey(m => m.SenderId)
            //    .OnDelete(DeleteBehavior.Restrict); // Không xóa messages khi xóa user

            // User → Messages (One-to-Many - Received)
            //builder.HasMany(u => u.ReceivedMessages)
            //    .WithOne(m => m.Receiver)
            //    .HasForeignKey(m => m.ReceiverId)
            //    .OnDelete(DeleteBehavior.Restrict);
        }
    }
}