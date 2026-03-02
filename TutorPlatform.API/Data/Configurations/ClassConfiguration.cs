using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.Configurations
{
    public class ClassConfiguration : IEntityTypeConfiguration<Class>
    {
        public void Configure(EntityTypeBuilder<Class> builder)
        {
            builder.ToTable("Classes");

            // Primary Key
            builder.HasKey(c => c.Id);

            // Properties
            builder.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(2000);

            // Decimal precision (quan trọng cho tiền!)
            builder.Property(c => c.PricePerSession)
                .HasPrecision(18, 2); // 18 digits, 2 decimal places

            // Enum
            builder.Property(c => c.Status)
                .HasConversion<int>();
                        
            builder.Property(c => c.CurrentStudents)
                .HasDefaultValue(0);

            // Indexes
            builder.HasIndex(c => c.TutorId);
            builder.HasIndex(c => c.SubjectId);
            builder.HasIndex(c => c.Status);
           // builder.HasIndex(c => new { c.Status, c.IsOpenForBooking }); // Composite index

            // Relationships
            builder.HasOne(c => c.Tutor)
                .WithMany(t => t.Classes)
                .HasForeignKey(c => c.TutorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Subject)
                .WithMany(s => s.Classes)
                .HasForeignKey(c => c.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(c => c.Bookings)
                .WithOne(b => b.Class)
                .HasForeignKey(b => b.ClassId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}