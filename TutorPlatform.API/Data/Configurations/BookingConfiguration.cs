using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            // Tên bảng trong database
            builder.ToTable("Bookings");

            // Khóa chính
            builder.HasKey(b => b.Id);

            // Cấu hình các thuộc tính (nếu cần)
            builder.Property(b => b.Note)
                .HasMaxLength(500); // Ví dụ: giới hạn độ dài

            // Quan hệ với Student
            builder.HasOne(b => b.Student)
                .WithMany(s => s.Bookings) // Giả sử Student có collection Bookings
                .HasForeignKey(b => b.StudentId)
                .OnDelete(DeleteBehavior.Restrict); // Tránh cascade nhiều đường

            // Quan hệ với Tutor
            builder.HasOne(b => b.Tutor)
                .WithMany(t => t.Bookings) // Giả sử Tutor có collection Bookings
                .HasForeignKey(b => b.TutorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ với Class
            builder.HasOne(b => b.Class)
                .WithMany(c => c.Bookings) // Giả sử Class có collection Bookings
                .HasForeignKey(b => b.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ 1-1 với Payment (giả sử Payment có khóa ngoại BookingId)
            builder.HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<Payment>(p => p.BookingId) // Payment phải có property BookingId
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}