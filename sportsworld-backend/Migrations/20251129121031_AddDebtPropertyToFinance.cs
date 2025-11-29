using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sportsworld_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDebtPropertyToFinance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Debt",
                table: "Finances",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Debt",
                table: "Finances");
        }
    }
}
