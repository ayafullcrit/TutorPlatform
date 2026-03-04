using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.Configurations
{
    public class TutorConfiguration
    {
        public void Configure(EntityTypeBuilder<Tutor> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(t => t.UserId);
            builder.Property(t => t.Rating)
                .HasDefaultValue(0.0);
            builder.Property(t => t.TotalReviews)
                .HasDefaultValue(0);
           builder.Property(t => t.IsVerified)
                .HasDefaultValue(false);
        }
    }
}