using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Métricas agregadas de socios para el panel de resumen.
/// </summary>
public partial class SociosController
{
    // =========================================================
    // GET: api/Socios/estadisticas
    // Todos los roles pueden consultar el resumen.
    // =========================================================

    [HttpGet("estadisticas")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<IActionResult> GetEstadisticas()
    {
        var hoy = DateTime.UtcNow.Date;
        var inicioMes = new DateTime(hoy.Year, hoy.Month, 1);
        var limite = hoy.AddDays(7);

        var socios = await _context.Socios.ToListAsync();
        var membresias = await _context.Membresias.ToListAsync();

        var nuevosMes = socios.Count(s => s.FechaAlta >= inicioMes);
        var cumpleMes = socios.Count(s =>
            s.Activo && s.FechaNacimiento.Month == hoy.Month);
        var vencidas = membresias.Count(m => m.FechaFin < hoy);
        var porVencer = membresias.Count(m =>
            m.FechaFin >= hoy && m.FechaFin <= limite);

        var altasPorMes = Enumerable.Range(0, 6)
            .Select(offset =>
            {
                var d = hoy.AddMonths(-offset);
                var ini = new DateTime(d.Year, d.Month, 1);
                var fin = ini.AddMonths(1);

                return new
                {
                    mes = ini.ToString("yyyy-MM"),
                    cantidad = socios.Count(s =>
                        s.FechaAlta >= ini && s.FechaAlta < fin)
                };
            })
            .Reverse()
            .ToList();

        return Ok(new
        {
            total = socios.Count,
            activos = socios.Count(s => s.Activo),
            inactivos = socios.Count(s => !s.Activo),
            nuevosMes,
            cumpleMes,
            vencidas,
            porVencer,
            altasPorMes
        });
    }
}
