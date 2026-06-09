using Microsoft.EntityFrameworkCore;
using TutorPlatform.API.Models.Entities;
using TutorPlatform.API.Models.Enums;

namespace TutorPlatform.API.Data.SeedData
{
    public static class RuntimeDemoSeeder
    {
        private const string DemoPasswordHash = "$2a$11$6jKvXzVmVqS9z3dMYvN4h.vhvXJ2qN5YZHvKxGt5L8YKQNhJy3gx.";

        private static readonly string[] Wards =
        {
            "Phuong Hai Van",
            "Phuong Lien Chieu",
            "Phuong Hoa Khanh",
            "Phuong Thanh Khe",
            "Phuong Hai Chau",
            "Phuong Hoa Cuong",
            "Phuong Cam Le",
            "Phuong Son Tra",
            "Phuong An Hai",
            "Phuong Ngu Hanh Son",
            "Phuong An Khe",
            "Phuong Hoa Xuan",
            "Phuong Ban Thach",
            "Phuong Tam Ky",
            "Phuong Huong Tra",
            "Phuong Quang Phu",
            "Phuong Hoi An Tay",
            "Phuong Hoi An",
            "Phuong Hoi An Dong",
            "Phuong Dien Ban",
            "Phuong Dien Ban Bac",
            "Phuong An Thang",
            "Phuong Dien Ban Dong"
        };

        private static readonly string[] Schools =
        {
            "THCS Nguyen Du",
            "THCS Tay Son",
            "THCS Ly Tu Trong",
            "THPT Phan Chau Trinh",
            "THPT Tran Phu",
            "THPT Le Quy Don",
            "THPT Nguyen Hien",
            "THPT Thai Phien"
        };

        private static readonly string[] StudentLastNames = { "Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Dang", "Bui", "Do" };
        private static readonly string[] StudentMiddleNames = { "Minh", "Gia", "Duc", "Bao", "Thanh", "Quoc", "Ngoc", "Hoai", "Anh", "Tuan" };
        private static readonly string[] StudentFirstNames = { "An", "Binh", "Chau", "Dung", "Giang", "Ha", "Khanh", "Linh", "Nam", "Phong", "Quynh", "Trang" };
        private static readonly string[] TutorLastNames = { "Nguyen", "Tran", "Le", "Pham", "Vo", "Dang", "Phan", "Do", "Huynh", "Ho" };
        private static readonly string[] TutorMiddleNames = { "Thu", "Minh", "Thanh", "Quang", "Ngoc", "Thi", "Gia", "Anh", "Bao", "Phuong" };
        private static readonly string[] TutorFirstNames = { "Lan", "Huong", "Vy", "Hanh", "Linh", "Phuc", "Kiet", "Son", "Tri", "My" };

        private sealed record ClassTemplate(
            int SubjectId,
            string TitlePrefix,
            string Description,
            int GradeLevel,
            decimal PricePerSession,
            int DurationMinutes,
            int SessionsPerWeek,
            int MaxStudents
        );

        private static readonly ClassTemplate[] ClassTemplates =
        {
            new(1, "Toan", "Luyen nen tang, tu duy va giai de theo muc tieu ro rang.", 6, 140000m, 90, 2, 8),
            new(1, "Toan", "On tap giua ky, cuoi ky va boi duong hoc sinh kha gioi.", 9, 180000m, 120, 3, 10),
            new(2, "Vat ly", "Hoc theo chu de co hoc, dien hoc, quang hoc voi vi du de hieu.", 10, 170000m, 90, 2, 8),
            new(3, "Hoa hoc", "He thong cong thuc, phan loai dang bai va bai tap thuc hanh.", 11, 190000m, 120, 2, 8),
            new(4, "Tieng Anh", "Ren ngu phap, tu vung, nghe noi doc viet theo lo trinh.", 7, 160000m, 90, 3, 12),
            new(4, "Tieng Anh", "On thi vao 10 va luyen de theo tung ky nang.", 9, 180000m, 90, 2, 10),
            new(5, "Ngu van", "Cam thu tac pham, lap dan y va viet doan van logic.", 8, 150000m, 90, 2, 8),
            new(6, "Lich su", "Tong hop kien thuc theo so do, nho nhanh va lam trac nghiem.", 12, 150000m, 90, 2, 10),
            new(7, "Dia ly", "He thong atlat, dang bai bieu do va phan tich du lieu.", 12, 155000m, 90, 2, 10),
            new(8, "Tin hoc", "Luyen tu duy lap trinh co ban va ky nang office ung dung.", 8, 200000m, 120, 2, 6),
            new(9, "Sinh hoc", "He thong ly thuyet, bai tap di truyen va bai tap van dung.", 12, 175000m, 90, 2, 8),
            new(10, "GDCD", "Tong hop ly thuyet, tinh huong va cau hoi van dung.", 11, 130000m, 75, 2, 12),
        };

        public static async Task EnsureDemoDataAsync(ApplicationDbContext context)
        {
            var hasAnyDemoUser = await context.Users.AnyAsync(u =>
                EF.Functions.Like(u.Email, "student%@demo.local") ||
                EF.Functions.Like(u.Email, "tutor%@demo.local"));

            if (hasAnyDemoUser)
            {
                return;
            }

            var studentUsers = new List<User>();
            for (var i = 0; i < 60; i++)
            {
                var fullName = BuildName(StudentLastNames, StudentMiddleNames, StudentFirstNames, i);
                var ward = Wards[i % Wards.Length];

                studentUsers.Add(new User
                {
                    Email = $"student{i + 1}@demo.local",
                    PasswordHash = DemoPasswordHash,
                    FullName = fullName,
                    PhoneNumber = $"090{i + 1:0000000}",
                    Address = ward,
                    AvatarUrl = string.Empty,
                    Balance = 0,
                    Role = UserRole.Student,
                    IsActive = true
                });
            }

            var tutorUsers = new List<User>();
            for (var i = 0; i < 40; i++)
            {
                var fullName = BuildName(TutorLastNames, TutorMiddleNames, TutorFirstNames, i);
                var ward = Wards[(i + 7) % Wards.Length];

                tutorUsers.Add(new User
                {
                    Email = $"tutor{i + 1}@demo.local",
                    PasswordHash = DemoPasswordHash,
                    FullName = fullName,
                    PhoneNumber = $"091{i + 1:0000000}",
                    Address = ward,
                    AvatarUrl = string.Empty,
                    Balance = 0,
                    Role = UserRole.Tutor,
                    IsActive = true
                });
            }

            context.Users.AddRange(studentUsers);
            context.Users.AddRange(tutorUsers);
            await context.SaveChangesAsync();

            var students = studentUsers.Select((user, i) => new Student
            {
                UserId = user.Id,
                Address = user.Address,
                GradeLevel = 6 + (i % 7),
                School = Schools[i % Schools.Length],
                IsActive = true
            }).ToList();

            var tutors = tutorUsers.Select((user, i) => new Tutor
            {
                UserId = user.Id,
                Rating = Math.Round(4.2 + (i % 7) * 0.1, 1),
                TotalReviews = 8 + (i % 18),
                IsVerified = true,
                VerificationStatus = VerificationStatus.Approved,
                VerificationNote = "Seeded demo tutor",
                HourlyRate = 180000m + (i % 6) * 30000m
            }).ToList();

            context.Students.AddRange(students);
            context.Tutors.AddRange(tutors);
            await context.SaveChangesAsync();

            var classes = new List<Class>();
            foreach (var pair in tutorUsers.Select((user, index) => new { user, index }))
            {
                for (var j = 0; j < 2; j++)
                {
                    var template = ClassTemplates[(pair.index * 2 + j) % ClassTemplates.Length];
                    var gradeLevel = Math.Min(12, Math.Max(1, template.GradeLevel + ((pair.index + j) % 2)));

                    classes.Add(new Class
                    {
                        TutorId = pair.user.Id,
                        SubjectId = template.SubjectId,
                        GradeLevel = gradeLevel,
                        Title = $"{template.TitlePrefix} lop {gradeLevel} - Lop {j + 1} cua {pair.user.FullName}",
                        Description = $"{template.Description} Gia su {pair.user.FullName} dong hanh voi hoc vien theo lo trinh ca nhan hoa.",
                        ThumbnailUrl = string.Empty,
                        PricePerSession = template.PricePerSession + (pair.index % 3) * 10000m,
                        DurationInMinutes = template.DurationMinutes,
                        StartTime = new DateTime(2026, 1, 6, 18 + (j % 2), 0, 0, DateTimeKind.Utc),
                        TotalSessions = 24 + (pair.index % 3) * 6,
                        SessionsPerWeek = template.SessionsPerWeek,
                        CurrentStudents = 0,
                        MaxStudents = template.MaxStudents,
                        Status = ClassStatus.Active
                    });
                }
            }

            context.Classes.AddRange(classes);
            await context.SaveChangesAsync();
        }

        private static string BuildName(
            IReadOnlyList<string> lastNames,
            IReadOnlyList<string> middleNames,
            IReadOnlyList<string> firstNames,
            int index)
        {
            var lastName = lastNames[index % lastNames.Count];
            var middleName = middleNames[(index / lastNames.Count) % middleNames.Count];
            var firstName = firstNames[(index / (lastNames.Count * 2)) % firstNames.Count];
            return $"{lastName} {middleName} {firstName}";
        }
    }
}
