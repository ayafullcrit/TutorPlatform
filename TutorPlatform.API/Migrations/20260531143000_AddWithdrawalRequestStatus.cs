using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TutorPlatform.API.Migrations
{
    public partial class AddWithdrawalRequestStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WithdrawalStatus",
                table: "Transactions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WithdrawalStatus",
                table: "Transactions");
        }
    }
}
