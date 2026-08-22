using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class CrearInvitacionesAdministrador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_InscripcionesClases_InscripcionClaseId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Socios_SocioId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_HorariosClases_Clases_ClaseId",
                table: "HorariosClases");

            migrationBuilder.DropForeignKey(
                name: "FK_HorariosClases_Empleados_EmpleadoId",
                table: "HorariosClases");

            migrationBuilder.DropForeignKey(
                name: "FK_InscripcionesClases_HorariosClases_HorarioClaseId",
                table: "InscripcionesClases");

            migrationBuilder.DropForeignKey(
                name: "FK_InscripcionesClases_Socios_SocioId",
                table: "InscripcionesClases");

            migrationBuilder.DropIndex(
                name: "IX_PlanesClases_PlanId",
                table: "PlanesClases");

            migrationBuilder.DropIndex(
                name: "IX_PlanesBeneficios_PlanId",
                table: "PlanesBeneficios");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Usuarios",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Roles",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "DNI",
                table: "Empleados",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Beneficios",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "InvitacionesAdministrador",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaExpiracion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Usada = table.Column<bool>(type: "bit", nullable: false),
                    FechaUso = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UsuarioCreadoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvitacionesAdministrador", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Nombre",
                table: "Roles",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanesClases_PlanId_ClaseId",
                table: "PlanesClases",
                columns: new[] { "PlanId", "ClaseId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlanesBeneficios_PlanId_BeneficioId",
                table: "PlanesBeneficios",
                columns: new[] { "PlanId", "BeneficioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Empleados_DNI",
                table: "Empleados",
                column: "DNI",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Beneficios_Nombre",
                table: "Beneficios",
                column: "Nombre",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_InscripcionesClases_InscripcionClaseId",
                table: "Asistencias",
                column: "InscripcionClaseId",
                principalTable: "InscripcionesClases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Socios_SocioId",
                table: "Asistencias",
                column: "SocioId",
                principalTable: "Socios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HorariosClases_Clases_ClaseId",
                table: "HorariosClases",
                column: "ClaseId",
                principalTable: "Clases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HorariosClases_Empleados_EmpleadoId",
                table: "HorariosClases",
                column: "EmpleadoId",
                principalTable: "Empleados",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InscripcionesClases_HorariosClases_HorarioClaseId",
                table: "InscripcionesClases",
                column: "HorarioClaseId",
                principalTable: "HorariosClases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_InscripcionesClases_Socios_SocioId",
                table: "InscripcionesClases",
                column: "SocioId",
                principalTable: "Socios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_InscripcionesClases_InscripcionClaseId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_Asistencias_Socios_SocioId",
                table: "Asistencias");

            migrationBuilder.DropForeignKey(
                name: "FK_HorariosClases_Clases_ClaseId",
                table: "HorariosClases");

            migrationBuilder.DropForeignKey(
                name: "FK_HorariosClases_Empleados_EmpleadoId",
                table: "HorariosClases");

            migrationBuilder.DropForeignKey(
                name: "FK_InscripcionesClases_HorariosClases_HorarioClaseId",
                table: "InscripcionesClases");

            migrationBuilder.DropForeignKey(
                name: "FK_InscripcionesClases_Socios_SocioId",
                table: "InscripcionesClases");

            migrationBuilder.DropTable(
                name: "InvitacionesAdministrador");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Roles_Nombre",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_PlanesClases_PlanId_ClaseId",
                table: "PlanesClases");

            migrationBuilder.DropIndex(
                name: "IX_PlanesBeneficios_PlanId_BeneficioId",
                table: "PlanesBeneficios");

            migrationBuilder.DropIndex(
                name: "IX_Empleados_DNI",
                table: "Empleados");

            migrationBuilder.DropIndex(
                name: "IX_Beneficios_Nombre",
                table: "Beneficios");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "DNI",
                table: "Empleados",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Beneficios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_PlanesClases_PlanId",
                table: "PlanesClases",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PlanesBeneficios_PlanId",
                table: "PlanesBeneficios",
                column: "PlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_InscripcionesClases_InscripcionClaseId",
                table: "Asistencias",
                column: "InscripcionClaseId",
                principalTable: "InscripcionesClases",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Asistencias_Socios_SocioId",
                table: "Asistencias",
                column: "SocioId",
                principalTable: "Socios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HorariosClases_Clases_ClaseId",
                table: "HorariosClases",
                column: "ClaseId",
                principalTable: "Clases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HorariosClases_Empleados_EmpleadoId",
                table: "HorariosClases",
                column: "EmpleadoId",
                principalTable: "Empleados",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InscripcionesClases_HorariosClases_HorarioClaseId",
                table: "InscripcionesClases",
                column: "HorarioClaseId",
                principalTable: "HorariosClases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InscripcionesClases_Socios_SocioId",
                table: "InscripcionesClases",
                column: "SocioId",
                principalTable: "Socios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
