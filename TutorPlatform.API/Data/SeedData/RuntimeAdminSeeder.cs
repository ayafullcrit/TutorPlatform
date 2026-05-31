using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Data.SeedData
{
    public static class RuntimeAdminSeeder
    {
        public static async Task EnsureAdminUserAsync(ApplicationDbContext context)
        {
            const string email = "admin@tutorplatform.com";
            const string password = "Admin@123";

            var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            if (admin == null)
            {
                context.Users.Add(new User
                {
                    Email = email,
                    PasswordHash = passwordHash,
                    FullName = "System Administrator",
                    PhoneNumber = "0123456789",
                    AvatarUrl = "/images/avatars/admin.png",
                    Role = UserRole.Admin,
                    IsActive = true,
                    Address = "",
                    Balance = 0
                });
                await context.SaveChangesAsync();
                return;
            }

            admin.PasswordHash = passwordHash;
            admin.Role = UserRole.Admin;
            admin.IsActive = true;
            admin.FullName = "System Administrator";
            admin.PhoneNumber = "0123456789";
            admin.AvatarUrl = "/images/avatars/admin.png";
            await context.SaveChangesAsync();
        }
    }
}
