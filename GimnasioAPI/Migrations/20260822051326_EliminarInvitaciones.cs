using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class EliminarInvitaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvitacionesUsuarios");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvitacionesUsuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RolId = table.Column<int>(type: "int", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaExpiracion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaUso = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Usada = table.Column<bool>(type: "bit", nullable: false),
                    UsuarioCreadoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvitacionesUsuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvitacionesUsuarios_Roles_RolId",
                        column: x => x.RolId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvitacionesUsuarios_Codigo",
                table: "InvitacionesUsuarios",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvitacionesUsuarios_RolId",
                table: "InvitacionesUsuarios",
                column: "RolId");
        }
    }
}
