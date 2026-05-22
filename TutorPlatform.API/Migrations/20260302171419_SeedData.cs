using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TutorPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "CostPerHour", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, 0m, "Đại số, Hình học, Giải tích", true, "Toán học" },
                    { 2, 0m, "Cơ học, Điện học, Quang học", true, "Vật lý" },
                    { 3, 0m, "Hóa vô cơ, Hóa hữu cơ", true, "Hóa học" },
                    { 4, 0m, "Ngữ pháp, Giao tiếp, IELTS, TOEIC", true, "Tiếng Anh" },
                    { 5, 0m, "Văn học, Làm văn, Phân tích tác phẩm", true, "Ngữ văn" },
                    { 6, 0m, "Lịch sử Việt Nam, Lịch sử thế giới", true, "Lịch sử" },
                    { 7, 0m, "Địa lý tự nhiên, Địa lý kinh tế", true, "Địa lý" },
                    { 8, 0m, "Lập trình, Office, Tin học văn phòng", true, "Tin học" },
                    { 9, 0m, "Sinh học tế bào, Di truyền học", true, "Sinh học" },
                    { 10, 0m, "Giáo dục công dân", true, "GDCD" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "AvatarUrl", "Balance", "Email", "FullName", "IsActivated", "PasswordHash", "PhoneNumber", "Role" },
                values: new object[] { 1, "", "/images/avatars/admin.png", 0.0, "admin@tutorplatform.com", "System Administrator", true, "$2a$11$6jKvXzVmVqS9z3dMYvN4h.vhvXJ2qN5YZHvKxGt5L8YKQNhJy3gx.", "0123456789", 3 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
