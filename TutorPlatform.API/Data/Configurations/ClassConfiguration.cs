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

            builder.HasKey(c => c.Id);

            builder.Property(c => c.GradeLevel)
                .IsRequired();
            builder.ToTable(t => t.HasCheckConstraint("CK_Class_GradeLevel", "GradeLevel >= 1 AND GradeLevel <= 12"));

            builder.Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(c => c.PricePerSession)
                .HasPrecision(18, 2); 

            builder.Property(c => c.Status)
                .HasConversion<int>();
                        
            builder.Property(c => c.CurrentStudents)
                .HasDefaultValue(0);

            builder.Property(c => c.MaxStudents)
               .HasDefaultValue(10);

            builder.Property(c => c.ThumbnailUrl)
               .HasMaxLength(500);

            builder.Property(c => c.DurationInMinutes)
               .IsRequired();

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