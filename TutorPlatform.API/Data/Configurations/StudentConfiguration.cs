using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.Configurations
{ 
    public class StudentConfiguration 
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.ToTable("Students");
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Address)
                .IsRequired()
                .HasMaxLength(255);
            builder.Property(u => u.GradeLevel)
                .IsRequired();
            builder.Property(u => u.IsActive)
                .HasDefaultValue(false);

            builder.HasOne(u => u.User)
                .WithOne(s => s.Student)
                .HasForeignKey<Student>(s => s.Id)
                .OnDelete(DeleteBehavior.Cascade);//One to one
        }
    }
}
