using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class EliminarDuracionDiasPlanes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DuracionDias",
                table: "Planes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DuracionDias",
                table: "Planes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
