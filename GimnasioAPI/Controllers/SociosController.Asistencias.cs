using GimnasioAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Últimas asistencias de un socio para la ficha rápida.
/// </summary>
public partial class SociosController
{
    [HttpGet("{id}/asistencias")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<IActionResult> GetAsistenciasSocio(int id, [FromQuery] int limite = 10)
    {
        var socio = await _context.Socios.FindAsync(id);
        if (socio == null) return NotFound("El socio no existe.");

        var asistencias = await _context.Asistencias
            .Include(a => a.InscripcionClase)
                .ThenInclude(i => i!.HorarioClase)
                    .ThenInclude(h => h!.Clase)
            .Where(a => a.SocioId == id)
            .OrderByDescending(a => a.Fecha)
            .Take(Math.Clamp(limite, 1, 50))
            .Select(a => new
            {
                a.Id,
                a.Fecha,
                a.Presente,
                a.InscripcionClaseId,
                ClaseNombre = a.InscripcionClase != null
                    && a.InscripcionClase.HorarioClase != null
                    && a.InscripcionClase.HorarioClase.Clase != null
                    ? a.InscripcionClase.HorarioClase.Clase.Nombre
                    : null,
            })
            .ToListAsync();

        return Ok(asistencias);
    }
}
