using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TutorPlatform.API.Data.Configurations
{
    public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
    {
        public void Configure(EntityTypeBuilder<Subject> builder)
        {
            builder.ToTable("Subjects");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(80);
            builder.Property(s => s.Description)
                .HasMaxLength(500);
            builder.Property(s => s.IsActive)
                .HasDefaultValue(true);

            //indexing
            builder.HasIndex(s => s.IsActive);
        }
    }
}