using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sportsworld_backend.Migrations
{
    /// <inheritdoc />
    public partial class RenamePurchaseStatusToPurchased : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PurchaseStatus",
                table: "Athletes",
                newName: "Purchased");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Purchased",
                table: "Athletes",
                newName: "PurchaseStatus");
        }
    }
}
