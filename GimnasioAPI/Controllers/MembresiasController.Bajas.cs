using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Bajas de membresias: cancelacion logica y eliminacion fisica.
/// </summary>
public partial class MembresiasController
{
    // =========================================================
    // PUT: api/Membresias/5/cancelar — Baja lógica.
    // El historial se conserva; libera al socio para otra
    // membresía. Administrador y Recepcionista.
    // =========================================================

    [HttpPut("{id}/cancelar")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> CancelarMembresia(int id)
    {
        var membresia = await _context.Membresias.FindAsync(id);

        if (membresia == null)
        {
            return NotFound("La membresía no existe.");
        }

        if (membresia.Estado == EstadoMembresia.Cancelada)
        {
            return BadRequest("La membresía ya está cancelada.");
        }

        membresia.Estado = EstadoMembresia.Cancelada;

        await _context.SaveChangesAsync();
        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaMembresia.Cancelacion,
            membresia,
            "Membresía cancelada.");

        return NoContent();
    }

    // =========================================================
    // DELETE: api/Membresias/5 — SOLO Administrador.
    // =========================================================

    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> DeleteMembresia(int id)
    {
        var membresia = await _context.Membresias.FindAsync(id);

        if (membresia == null)
        {
            return NotFound("La membresía no existe.");
        }

        _context.Membresias.Remove(membresia);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
