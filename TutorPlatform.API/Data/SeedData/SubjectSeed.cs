using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;

namespace TutorPlatform.API.Data.SeedData
{
    /// <summary>
    /// Seed dữ liệu môn học
    /// </summary>
    public static class SubjectsSeed
    {
        public static void SeedSubjects(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Subject>().HasData(
                new Subject
                {
                    Id = 1,
                    Name = "Toán học",
                    Description = "Đại số, Hình học, Giải tích",
                  //  Icon = "/images/subjects/math.png",
                    IsActive = true,
                   // DisplayOrder = 1,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 2,
                    Name = "Vật lý",
                    Description = "Cơ học, Điện học, Quang học",
                   // Icon = "/images/subjects/physics.png",
                    IsActive = true,
                   // DisplayOrder = 2,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 3,
                    Name = "Hóa học",
                    Description = "Hóa vô cơ, Hóa hữu cơ",
                   // Icon = "/images/subjects/chemistry.png",
                    IsActive = true,
                   // DisplayOrder = 3,
                    //CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 4,
                    Name = "Tiếng Anh",
                    Description = "Ngữ pháp, Giao tiếp, IELTS, TOEIC",
                   // Icon = "/images/subjects/english.png",
                    IsActive = true,
                    //DisplayOrder = 4,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 5,
                    Name = "Ngữ văn",
                    Description = "Văn học, Làm văn, Phân tích tác phẩm",
                  //  Icon = "/images/subjects/literature.png",
                    IsActive = true,
                   // DisplayOrder = 5,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 6,
                    Name = "Lịch sử",
                    Description = "Lịch sử Việt Nam, Lịch sử thế giới",
                  //  Icon = "/images/subjects/history.png",
                    IsActive = true,
                  //  DisplayOrder = 6,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 7,
                    Name = "Địa lý",
                    Description = "Địa lý tự nhiên, Địa lý kinh tế",
                   // Icon = "/images/subjects/geography.png",
                    IsActive = true,
                   // DisplayOrder = 7,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 8,
                    Name = "Tin học",
                    Description = "Lập trình, Office, Tin học văn phòng",
                   // Icon = "/images/subjects/computer.png",
                    IsActive = true,
                   // DisplayOrder = 8,
                   // CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 9,
                    Name = "Sinh học",
                    Description = "Sinh học tế bào, Di truyền học",
                  //  Icon = "/images/subjects/biology.png",
                    IsActive = true,
                  //  DisplayOrder = 9,
                  //  CreatedAt = DateTime.UtcNow
                },
                new Subject
                {
                    Id = 10,
                    Name = "GDCD",
                    Description = "Giáo dục công dân",
                  //  Icon = "/images/subjects/civic.png",
                    IsActive = true,
                  //  DisplayOrder = 10,
                  //  CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}