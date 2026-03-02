using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Models.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.ToTable("Reviews");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .ValueGeneratedOnAdd();

            builder.Property(r => r.StudentId)
                .IsRequired()
                .HasMaxLength(450);

            builder.Property(r => r.TutorId)
                .IsRequired();

            builder.Property(r => r.Rating)
                .IsRequired()
                .HasDefaultValue(5);

            builder.Property(r => r.Comment)
                .IsRequired(false)
                .HasMaxLength(1000);

            builder.Property(r => r.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()")
                .ValueGeneratedOnAdd();

            builder.Property(r => r.IsVerified)
                .IsRequired()
                .HasDefaultValue(false);

            // Indexes
            builder.HasIndex(r => r.StudentId).HasDatabaseName("IX_Reviews_StudentId");
            builder.HasIndex(r => r.TutorId).HasDatabaseName("IX_Reviews_TutorId");
            builder.HasIndex(r => new { r.TutorId, r.Rating }).HasDatabaseName("IX_Reviews_TutorId_Rating");
            builder.HasIndex(r => r.CreatedAt).HasDatabaseName("IX_Reviews_CreatedAt");

            // Relationships with NO ACTION delete behavior
            builder.HasOne(r => r.Student)
                .WithMany(s => s.Reviews) // Giả sử Student có collection Reviews
                .HasForeignKey(r => r.StudentId)
                .OnDelete(DeleteBehavior.NoAction);  // Thay Restrict bằng NoAction

            builder.HasOne(r => r.Tutor)
                .WithMany(t => t.Reviews) // Giả sử Tutor có collection Reviews
                .HasForeignKey(r => r.TutorId)
                .OnDelete(DeleteBehavior.NoAction);  // Thay Restrict bằng NoAction

            // Check constraint cho Rating
            builder.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", "Rating >= 1 AND Rating <= 5"));

            // Unique constraint: mỗi student chỉ review một tutor một lần
            builder.HasIndex(r => new { r.StudentId, r.TutorId })
                .IsUnique()
                .HasDatabaseName("IX_Reviews_StudentId_TutorId_Unique");
        }
    }
}