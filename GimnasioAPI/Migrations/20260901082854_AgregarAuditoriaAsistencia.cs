using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregarAuditoriaAsistencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DetalleMotivo",
                table: "Asistencias",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaModificacion",
                table: "Asistencias",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Motivo",
                table: "Asistencias",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RegistradoPor",
                table: "Asistencias",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RegistradoPorId",
                table: "Asistencias",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DetalleMotivo",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "FechaModificacion",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "Motivo",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "RegistradoPor",
                table: "Asistencias");

            migrationBuilder.DropColumn(
                name: "RegistradoPorId",
                table: "Asistencias");
        }
    }
}
