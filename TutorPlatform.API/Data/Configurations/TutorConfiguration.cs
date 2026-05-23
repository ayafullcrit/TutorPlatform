using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.Configurations
{
    public class TutorConfiguration : IEntityTypeConfiguration<Tutor>
    {
        public void Configure(EntityTypeBuilder<Tutor> builder)
        {
            // Map tutors to their own table
            builder.ToTable("Tutors");
            builder.HasKey(t => t.UserId);

            builder.Property(t => t.Rating);

            builder.Property(t => t.TotalReviews);

            builder.Property(t => t.IsVerified);

            // Ensure HourlyRate has an explicit precision to avoid silent truncation
            builder.Property(t => t.HourlyRate)
                .HasPrecision(18, 2);

        }
    }
}
