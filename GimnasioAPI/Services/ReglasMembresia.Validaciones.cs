using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

/// <summary>
/// Parte de ReglasMembresia con las validaciones compartidas
/// por el alta y la actualización de membresías.
/// </summary>
public partial class ReglasMembresia
{
    // =========================================================
    // VALIDACIÓN PARA ALTA / ACTUALIZACIÓN
    //
    // Socio activo, plan activo, coherencia de fechas y
    // ausencia de solapamiento. Devuelve el plan cargado
    // (necesario para calcular el precio) o el error.
    // =========================================================

    public async Task<(Plan? Plan, string Error)>
        ValidarParaAltaOEdicionAsync(
            Membresia membresia,
            int? excluirId = null)
    {
        var socioExiste = await _context.Socios.AnyAsync(
            s => s.Id == membresia.SocioId && s.Activo);

        if (!socioExiste)
        {
            return (null, "El socio no existe o está inactivo.");
        }

        var plan = await _context.Planes.FirstOrDefaultAsync(
            p => p.Id == membresia.PlanId && p.Activo);

        if (plan == null)
        {
            return (null, "El plan no existe o está inactivo.");
        }

        if (membresia.FechaFin <= membresia.FechaInicio)
        {
            return (null,
                "La fecha de fin debe ser posterior a la fecha de inicio.");
        }

        if (await HaySolapamientoAsync(
                membresia.SocioId,
                membresia,
                excluirId))
        {
            return (null,
                "El socio ya tiene una membresía activa o pendiente " +
                "que se superpone con las fechas.");
        }

        return (plan, "");
    }
}
