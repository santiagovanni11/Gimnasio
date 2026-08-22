using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Ciclo de vida comercial del plan: pausa/reactivación
/// de la venta y baja física (solo sin membresías).
/// </summary>
public partial class PlanesController
{

    // PUT: api/Planes/5/estado â€” Solo Administrador.
    // Pausa/reactiva la VENTA del plan sin borrarlo: conserva
    // su historial de membresÃ­as y pagos asociados.
    [HttpPut("{id}/estado")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> CambiarEstadoPlan(
        int id,
        [FromBody] bool activo)
    {
        var plan = await _context.Planes.FindAsync(id);

        if (plan == null)
        {
            return NotFound("El plan no existe.");
        }

        plan.Activo = activo;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Planes/5 â€” Solo Administrador.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DeletePlan(int id)
    {
        var plan = await _context.Planes.FindAsync(id);

        if (plan == null)
        {
            return NotFound();
        }

        var conMembresias = _context.Membresias
            .Any(m => m.PlanId == id);

        if (conMembresias)
        {
            return BadRequest(
                "El plan tiene membresías asociadas: pausá la venta o reasigná antes de eliminarlo.");
        }

        _context.Planes.Remove(plan);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
