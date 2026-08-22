using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregarPreciosPorDuracion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Precio12Meses",
                table: "Planes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Precio1Mes",
                table: "Planes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Precio3Meses",
                table: "Planes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Precio6Meses",
                table: "Planes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Precio12Meses",
                table: "Planes");

            migrationBuilder.DropColumn(
                name: "Precio1Mes",
                table: "Planes");

            migrationBuilder.DropColumn(
                name: "Precio3Meses",
                table: "Planes");

            migrationBuilder.DropColumn(
                name: "Precio6Meses",
                table: "Planes");
        }
    }
}
