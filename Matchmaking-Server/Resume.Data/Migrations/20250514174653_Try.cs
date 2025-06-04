using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume.Data.Migrations
{
    /// <inheritdoc />
    public partial class Try : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIResponses_Users_UserId",
                table: "AIResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Sharings_SharingShareID",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "newUser");

            migrationBuilder.RenameIndex(
                name: "IX_Users_SharingShareID",
                table: "newUser",
                newName: "IX_newUser_SharingShareID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_newUser",
                table: "newUser",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_AIResponses_newUser_UserId",
                table: "AIResponses",
                column: "UserId",
                principalTable: "newUser",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_newUser_Sharings_SharingShareID",
                table: "newUser",
                column: "SharingShareID",
                principalTable: "Sharings",
                principalColumn: "ShareID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AIResponses_newUser_UserId",
                table: "AIResponses");

            migrationBuilder.DropForeignKey(
                name: "FK_newUser_Sharings_SharingShareID",
                table: "newUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_newUser",
                table: "newUser");

            migrationBuilder.RenameTable(
                name: "newUser",
                newName: "Users");

            migrationBuilder.RenameIndex(
                name: "IX_newUser_SharingShareID",
                table: "Users",
                newName: "IX_Users_SharingShareID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_AIResponses_Users_UserId",
                table: "AIResponses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Sharings_SharingShareID",
                table: "Users",
                column: "SharingShareID",
                principalTable: "Sharings",
                principalColumn: "ShareID");
        }
    }
}
