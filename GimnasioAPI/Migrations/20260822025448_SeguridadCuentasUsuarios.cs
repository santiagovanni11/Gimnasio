using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeguridadCuentasUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // -----------------------------------------------------
            // USUARIOS: nuevos campos de perfil y seguridad de login
            // -----------------------------------------------------

            migrationBuilder.AddColumn<DateTime>(
                name: "BloqueadoHasta",
                table: "Usuarios",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IntentosFallidos",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "Usuarios",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimoAcceso",
                table: "Usuarios",
                type: "datetime2",
                nullable: true);

            // Email pasa de 450 a 256: recrear su índice único.
            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Usuarios",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            // -----------------------------------------------------
            // INVITACIONES: renombre preservando datos y soporte
            // multi-rol (columna RolId obligatoria).
            // -----------------------------------------------------

            migrationBuilder.RenameTable(
                name: "InvitacionesAdministrador",
                newName: "InvitacionesUsuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_InvitacionesAdministrador",
                table: "InvitacionesUsuarios");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InvitacionesUsuarios",
                table: "InvitacionesUsuarios",
                column: "Id");

            migrationBuilder.AddColumn<int>(
                name: "RolId",
                table: "InvitacionesUsuarios",
                type: "int",
                nullable: true);

            // Backfill: las invitaciones existentes apuntaban
            // siempre al rol Administrador.
            migrationBuilder.Sql(@"
DECLARE @adminRolId int =
    (SELECT MIN(Id) FROM Roles WHERE Nombre = N'Administrador');

IF @adminRolId IS NULL
    DELETE FROM InvitacionesUsuarios WHERE RolId IS NULL;
ELSE
    UPDATE InvitacionesUsuarios
    SET RolId = @adminRolId
    WHERE RolId IS NULL;");

            migrationBuilder.AlterColumn<int>(
                name: "RolId",
                table: "InvitacionesUsuarios",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            // El código necesita largo acotado para indexarse.
            migrationBuilder.AlterColumn<string>(
                name: "Codigo",
                table: "InvitacionesUsuarios",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_InvitacionesUsuarios_Codigo",
                table: "InvitacionesUsuarios",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvitacionesUsuarios_RolId",
                table: "InvitacionesUsuarios",
                column: "RolId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvitacionesUsuarios_Roles_RolId",
                table: "InvitacionesUsuarios",
                column: "RolId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            // -----------------------------------------------------
            // AUDITORÍA DE CUENTAS (tabla nueva)
            // -----------------------------------------------------

            migrationBuilder.CreateTable(
                name: "AuditoriaUsuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Accion = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    EmailUsuario = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    RealizadoPorId = table.Column<int>(type: "int", nullable: true),
                    RealizadoPorEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Detalle = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    FechaUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditoriaUsuarios", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditoriaUsuarios_UsuarioId_FechaUtc",
                table: "AuditoriaUsuarios",
                columns: new[] { "UsuarioId", "FechaUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditoriaUsuarios");

            migrationBuilder.DropForeignKey(
                name: "FK_InvitacionesUsuarios_Roles_RolId",
                table: "InvitacionesUsuarios");

            migrationBuilder.DropIndex(
                name: "IX_InvitacionesUsuarios_RolId",
                table: "InvitacionesUsuarios");

            migrationBuilder.DropIndex(
                name: "IX_InvitacionesUsuarios_Codigo",
                table: "InvitacionesUsuarios");

            migrationBuilder.DropColumn(
                name: "RolId",
                table: "InvitacionesUsuarios");

            migrationBuilder.AlterColumn<string>(
                name: "Codigo",
                table: "InvitacionesUsuarios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 450);

            migrationBuilder.DropPrimaryKey(
                name: "PK_InvitacionesUsuarios",
                table: "InvitacionesUsuarios");

            migrationBuilder.AddPrimaryKey(
                name: "PK_InvitacionesAdministrador",
                table: "InvitacionesUsuarios",
                column: "Id");

            migrationBuilder.RenameTable(
                name: "InvitacionesUsuarios",
                newName: "InvitacionesAdministrador");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Usuarios",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.DropColumn(
                name: "BloqueadoHasta",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "IntentosFallidos",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "UltimoAcceso",
                table: "Usuarios");
        }
    }
}
