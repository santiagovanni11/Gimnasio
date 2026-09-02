using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Auditoría y vigencia de precios: consulta del historial,
/// registro de cada cambio y aplicación perezosa de cambios
/// pendientes (vigencia programada).
/// </summary>
public partial class PlanesController
{
    // =========================================================
    // GET: api/Planes/5/precios/historial
    // Solo Administrador.
    // =========================================================

    [HttpGet("{id}/precios/historial")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> GetHistorialPrecios(int id)
    {
        var filas = await _context.HistorialPreciosPlanes
            .Where(h => h.PlanId == id)
            .OrderByDescending(h => h.FechaUtc)
            .ThenByDescending(h => h.Id)
            .Select(h => new
            {
                h.Id,
                h.Usuario,
                h.FechaUtc,
                h.Estado,
                h.VigenteDesde,
                h.Precio1Mes,
                h.Precio3Meses,
                h.Precio6Meses,
                h.Precio12Meses
            })
            .ToListAsync();

        return Ok(filas);
    }

    // =========================================================
    // REGISTRO Y APLICACIÓN (usado por Comandos y Consultas)
    // =========================================================

    /// <summary>
    /// Registra el cambio. Si VigenteDesde es futura queda
    /// Pendiente; si no, se aplica al plan inmediatamente.
    /// </summary>
    private async Task RegistrarCambioPreciosAsync(
        int planId,
        ActualizarPreciosPlanDto precios)
    {
        var hoy = DateTime.UtcNow.Date;
        var programado =
            precios.VigenteDesde.HasValue &&
            precios.VigenteDesde.Value.Date > hoy;

        var fila = new HistorialPrecioPlan
        {
            PlanId = planId,
            Usuario = _auditoria.ObtenerEmailActor(),
            FechaUtc = DateTime.UtcNow,
            Estado = programado ? "Pendiente" : "Aplicada",
            VigenteDesde = precios.VigenteDesde,
            Precio1Mes = precios.Precio1Mes,
            Precio3Meses = precios.Precio3Meses,
            Precio6Meses = precios.Precio6Meses,
            Precio12Meses = precios.Precio12Meses
        };

        _context.HistorialPreciosPlanes.Add(fila);

        if (!programado)
        {
            var plan = await _context.Planes.FindAsync(planId);

            if (plan != null)
            {
                plan.Precio1Mes = precios.Precio1Mes;
                plan.Precio3Meses = precios.Precio3Meses;
                plan.Precio6Meses = precios.Precio6Meses;
                plan.Precio12Meses = precios.Precio12Meses;
            }
        }

        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Aplica de forma perezosa los cambios Pendientes cuyo
    /// día de vigencia llegó (patrón igual que el recálculo
    /// automático de estados de membresías).
    /// </summary>
    private async Task AplicarPendientesVencidosAsync()
    {
        var hoy = DateTime.UtcNow.Date;

        var pendientes = await _context.HistorialPreciosPlanes
            .Include(h => h.Plan)
            .Where(h => h.Estado == "Pendiente" &&
                        h.VigenteDesde != null &&
                        h.VigenteDesde.Value.Date <= hoy)
            .ToListAsync();

        foreach (var fila in pendientes)
        {
            if (fila.Plan == null) continue;

            fila.Plan.Precio1Mes = fila.Precio1Mes;
            fila.Plan.Precio3Meses = fila.Precio3Meses;
            fila.Plan.Precio6Meses = fila.Precio6Meses;
            fila.Plan.Precio12Meses = fila.Precio12Meses;
            fila.Estado = "Aplicada";
        }

        if (pendientes.Count > 0)
        {
            await _context.SaveChangesAsync();
        }
    }
}
