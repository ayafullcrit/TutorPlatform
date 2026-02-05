//using Microsoft.EntityFrameworkCore;
//using TutorPlatform.API.Models.Entities;

//namespace TutorPlatform.API.Data
//{
//    public class ApplicationDbContext : DbContext
//    {
//        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
//            : base(options)
//        {
//        }

//        public DbSet<User> Users { get; set; }
//        public DbSet<Student> Students { get; set; }
//        public DbSet<Tutor> Tutors { get; set; }
//        public DbSet<Subject> Subjects { get; set; }
//        public DbSet<Class> Classes { get; set; }
//        public DbSet<Booking> Bookings { get; set; }
//        public DbSet<Review> Reviews { get; set; }
//        public DbSet<Payment> Payments { get; set; }
//        public DbSet<Message> Messages { get; set; }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            base.OnModelCreating(modelBuilder);

//            // Apply configurations
//            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
//        }
//    }
//}
using Microsoft.EntityFrameworkCore;

namespace TutorPlatform.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
       
        }
    }
}