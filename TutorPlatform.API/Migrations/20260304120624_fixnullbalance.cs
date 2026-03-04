using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TutorPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class fixnullbalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Students_StudentId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Tutors_TutorId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Students_StudentId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Tutors_TutorId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Students_StudentId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Tutors_TutorId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_Id",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Tutors_Users_Id",
                table: "Tutors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tutors",
                table: "Tutors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Students",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Students");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Classes",
                newName: "StudentUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Classes_StudentId",
                table: "Classes",
                newName: "IX_Classes_StudentUserId");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActivated",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<decimal>(
                name: "Balance",
                table: "Users",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Users",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tutors",
                table: "Tutors",
                column: "UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Students",
                table: "Students",
                column: "UserId");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Balance",
                value: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Students_StudentId",
                table: "Bookings",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Tutors_TutorId",
                table: "Bookings",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Students_StudentUserId",
                table: "Classes",
                column: "StudentUserId",
                principalTable: "Students",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Tutors_TutorId",
                table: "Classes",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Students_StudentId",
                table: "Reviews",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Tutors_TutorId",
                table: "Reviews",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tutors_Users_UserId",
                table: "Tutors",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Students_StudentId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Tutors_TutorId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Students_StudentUserId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Classes_Tutors_TutorId",
                table: "Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Students_StudentId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Tutors_TutorId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Users_UserId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Tutors_Users_UserId",
                table: "Tutors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tutors",
                table: "Tutors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Students",
                table: "Students");

            migrationBuilder.RenameColumn(
                name: "StudentUserId",
                table: "Classes",
                newName: "StudentId");

            migrationBuilder.RenameIndex(
                name: "IX_Classes_StudentUserId",
                table: "Classes",
                newName: "IX_Classes_StudentId");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActivated",
                table: "Users",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<double>(
                name: "Balance",
                table: "Users",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Tutors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Students",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tutors",
                table: "Tutors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Students",
                table: "Students",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Balance",
                value: 0.0);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Students_StudentId",
                table: "Bookings",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Tutors_TutorId",
                table: "Bookings",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Students_StudentId",
                table: "Classes",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_Tutors_TutorId",
                table: "Classes",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Students_StudentId",
                table: "Reviews",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Tutors_TutorId",
                table: "Reviews",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Users_Id",
                table: "Students",
                column: "Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tutors_Users_Id",
                table: "Tutors",
                column: "Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
