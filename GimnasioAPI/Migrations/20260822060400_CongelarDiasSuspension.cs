using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GimnasioAPI.Migrations
{
    /// <inheritdoc />
    public partial class CongelarDiasSuspension : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaSuspension",
                table: "Membresias",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaSuspension",
                table: "Membresias");
        }
    }
}
