using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class RenovacionAutomatica : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MetodoPagoAlmacenadoId",
                table: "Membresias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RenovacionAutomatica",
                table: "Membresias",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "MetodosPagoAlmacenados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SocioId = table.Column<int>(type: "int", nullable: false),
                    Marca = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UltimosCuatro = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MesVencimiento = table.Column<int>(type: "int", nullable: false),
                    AnioVencimiento = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MetodosPagoAlmacenados", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MetodosPagoAlmacenados_Socios_SocioId",
                        column: x => x.SocioId,
                        principalTable: "Socios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Membresias_MetodoPagoAlmacenadoId",
                table: "Membresias",
                column: "MetodoPagoAlmacenadoId");

            migrationBuilder.CreateIndex(
                name: "IX_MetodosPagoAlmacenados_SocioId",
                table: "MetodosPagoAlmacenados",
                column: "SocioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Membresias_MetodosPagoAlmacenados_MetodoPagoAlmacenadoId",
                table: "Membresias",
                column: "MetodoPagoAlmacenadoId",
                principalTable: "MetodosPagoAlmacenados",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Membresias_MetodosPagoAlmacenados_MetodoPagoAlmacenadoId",
                table: "Membresias");

            migrationBuilder.DropTable(
                name: "MetodosPagoAlmacenados");

            migrationBuilder.DropIndex(
                name: "IX_Membresias_MetodoPagoAlmacenadoId",
                table: "Membresias");

            migrationBuilder.DropColumn(
                name: "MetodoPagoAlmacenadoId",
                table: "Membresias");

            migrationBuilder.DropColumn(
                name: "RenovacionAutomatica",
                table: "Membresias");
        }
    }
}
