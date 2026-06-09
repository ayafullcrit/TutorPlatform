using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Data.Configurations;
using TutorPlatform.API.Data.SeedData;

namespace TutorPlatform.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Tutor> Tutors { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<ClassEnrollment> ClassEnrollments { get; set; }
        public DbSet<TutorAvailability> TutorAvailabilities { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<PlatformSetting> PlatformSettings { get; set; }

        // Model configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            // Seed data
            SubjectsSeed.SeedSubjects(modelBuilder);
            AdminUserSeed.SeedAdminUser(modelBuilder);
            modelBuilder.Entity<PlatformSetting>().HasData(new PlatformSetting
            {
                Id = 1,
                PlatformFeeRate = 0.10m,
                UpdatedAt = new DateTime(2026, 1, 1)
            });

            modelBuilder.Entity<PlatformSetting>()
                .Property(x => x.PlatformFeeRate)
                .HasPrecision(18, 2);
        }
    }
}
