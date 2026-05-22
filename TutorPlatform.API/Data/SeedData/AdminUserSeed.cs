using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Data.SeedData
{
    /// <summary>
    /// Seed tài khoản Admin mặc định
    /// </summary>
    public static class AdminUserSeed
    {
        public static void SeedAdminUser(ModelBuilder modelBuilder)
        {
            // Password: "Admin@123" (đã hash bằng BCrypt)
            // Bạn sẽ cần hash password thật khi implement AuthService
            string hashedPassword = "$2a$11$6jKvXzVmVqS9z3dMYvN4h.vhvXJ2qN5YZHvKxGt5L8YKQNhJy3gx.";

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@tutorplatform.com",
                    PasswordHash = hashedPassword,
                    FullName = "System Administrator",
                    PhoneNumber = "0123456789",
                    AvatarUrl = "/images/avatars/admin.png",
                    Role = UserRole.Admin,
                    IsActivated = true,
                    //IsEmailVerified = true,
                   // CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}