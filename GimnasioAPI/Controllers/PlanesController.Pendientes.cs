using GimnasioAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Cambios de precios programados aún no vigentes, para el
/// aviso global del módulo de configuración de precios.
/// </summary>
public partial class PlanesController
{
    // =========================================================
    // GET: api/Planes/precios/pendientes
    // Solo Administrador.
    // =========================================================

    [HttpGet("precios/pendientes")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> GetCambiosPendientes()
    {
        var hoy = DateTime.UtcNow.Date;

        var pendientes = await _context.HistorialPreciosPlanes
            .Include(h => h.Plan)
            .Where(h => h.Estado == "Pendiente" &&
                        h.VigenteDesde != null &&
                        h.VigenteDesde.Value.Date > hoy)
            .OrderBy(h => h.VigenteDesde)
            .Select(h => new
            {
                h.Id,
                h.PlanId,
                PlanNombre =
                    h.Plan != null ? h.Plan.Nombre : "",
                h.VigenteDesde
            })
            .ToListAsync();

        return Ok(pendientes);
    }

    // =========================================================
    // DELETE: api/Planes/precios/pendientes/5
    //
    // Solo Administrador. Anula un cambio programado que aún
    // no rige: elimina el registro Pendiente y el plan sigue
    // con sus precios actuales. Los cambios ya aplicados no se
    // tocan (quedan como historial).
    // =========================================================

    [HttpDelete("precios/pendientes/{id:int}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> AnularCambioPendiente(
        int id)
    {
        var hoy = DateTime.UtcNow.Date;

        var pendiente = await _context.HistorialPreciosPlanes
            .FirstOrDefaultAsync(h =>
                h.Id == id &&
                h.Estado == "Pendiente" &&
                h.VigenteDesde != null &&
                h.VigenteDesde.Value.Date > hoy);

        if (pendiente == null)
        {
            return NotFound(
                "El cambio programado no existe o ya rige.");
        }

        // Traza: se marca como Anulada en lugar de borrar, para
        // conservar el registro de que existió y fue cancelado.
        pendiente.Estado = "Anulada";

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
