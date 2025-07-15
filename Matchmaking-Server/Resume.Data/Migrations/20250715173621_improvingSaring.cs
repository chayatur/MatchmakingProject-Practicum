using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume.Data.Migrations
{
    /// <inheritdoc />
    public partial class improvingSaring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_newUser_Sharings_SharingShareID",
                table: "newUser");

            migrationBuilder.DropIndex(
                name: "IX_newUser_SharingShareID",
                table: "newUser");

            migrationBuilder.DropColumn(
                name: "SharingShareID",
                table: "newUser");

            migrationBuilder.AddColumn<int>(
                name: "SharedByUserID",
                table: "Sharings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Sharings_SharedByUserID",
                table: "Sharings",
                column: "SharedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Sharings_SharedWithUserID",
                table: "Sharings",
                column: "SharedWithUserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Sharings_newUser_SharedByUserID",
                table: "Sharings",
                column: "SharedByUserID",
                principalTable: "newUser",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sharings_newUser_SharedWithUserID",
                table: "Sharings",
                column: "SharedWithUserID",
                principalTable: "newUser",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sharings_newUser_SharedByUserID",
                table: "Sharings");

            migrationBuilder.DropForeignKey(
                name: "FK_Sharings_newUser_SharedWithUserID",
                table: "Sharings");

            migrationBuilder.DropIndex(
                name: "IX_Sharings_SharedByUserID",
                table: "Sharings");

            migrationBuilder.DropIndex(
                name: "IX_Sharings_SharedWithUserID",
                table: "Sharings");

            migrationBuilder.DropColumn(
                name: "SharedByUserID",
                table: "Sharings");

            migrationBuilder.AddColumn<int>(
                name: "SharingShareID",
                table: "newUser",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_newUser_SharingShareID",
                table: "newUser",
                column: "SharingShareID");

            migrationBuilder.AddForeignKey(
                name: "FK_newUser_Sharings_SharingShareID",
                table: "newUser",
                column: "SharingShareID",
                principalTable: "Sharings",
                principalColumn: "ShareID");
        }
    }
}
