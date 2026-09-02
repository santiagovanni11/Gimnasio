using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Estados manuales de membresias: suspension y reactivacion.
/// Al suspender se congela el día de corte; al reactivar se
/// extiende la fecha de fin por esos días y se recalcula el
/// estado según vigencia.
/// </summary>
public partial class MembresiasController
{
    // =========================================================
    // PUT: api/Membresias/5/suspender
    // Solo Activa o Pendiente. Administrador y Recepcionista.
    // =========================================================

    [HttpPut("{id}/suspender")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> SuspenderMembresia(int id)
    {
        var membresia = await _context.Membresias.FindAsync(id);

        if (membresia == null)
        {
            return NotFound("La membresía no existe.");
        }

        var suspendible =
            membresia.Estado == EstadoMembresia.Activa ||
            membresia.Estado == EstadoMembresia.Pendiente;

        if (!suspendible)
        {
            return BadRequest(
                "Solo se pueden suspender membresías activas o pendientes.");
        }

        membresia.Estado = EstadoMembresia.Suspendida;
        membresia.FechaSuspension = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaMembresia.Suspencion,
            membresia,
            "Membresía suspendida.");

        return NoContent();
    }

    // =========================================================
    // PUT: api/Membresias/5/reactivar
    // Solo Suspendida. Extiende la fecha de fin por los días
    // congelados y recalcula el estado según vigencia.
    // =========================================================

    [HttpPut("{id}/reactivar")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> ReactivarMembresia(int id)
    {
        var membresia = await _context.Membresias.FindAsync(id);

        if (membresia == null)
        {
            return NotFound("La membresía no existe.");
        }

        if (membresia.Estado != EstadoMembresia.Suspendida)
        {
            return BadRequest(
                "Solo se pueden reactivar membresías suspendidas.");
        }

        CongelarDiasSuspendidos(membresia);

        // Sale del estado manual; el recálculo define el estado
        // real según las fechas ya extendidas.
        membresia.Estado = EstadoMembresia.Activa;

        ReglasMembresia.RecalcularEstado(
            membresia,
            DateTime.UtcNow);

        await _context.SaveChangesAsync();
        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaMembresia.Reactivacion,
            membresia,
            "Membresía reactivada; días congelados extendidos.");

        return NoContent();
    }

    /// <summary>
    /// Suma a FechaFin los días que la membresía pasó
    /// suspendida: el socio no pierde días pagados.
    /// </summary>
    private static void CongelarDiasSuspendidos(Membresia membresia)
    {
        if (membresia.FechaSuspension is DateTime suspendidaEn)
        {
            var diasSuspendidos =
                (DateTime.UtcNow.Date - suspendidaEn.Date).Days;

            if (diasSuspendidos > 0)
            {
                membresia.FechaFin =
                    membresia.FechaFin.AddDays(diasSuspendidos);
            }
        }

        membresia.FechaSuspension = null;
    }
}
