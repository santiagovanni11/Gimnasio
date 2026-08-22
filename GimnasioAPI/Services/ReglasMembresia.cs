using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

/// <summary>
/// Reglas de negocio de membresías: recálculo automático de
/// estado según fechas, precio por duración, membresías
/// rechazadas y control de solapamiento.
/// </summary>
public partial class ReglasMembresia
{
    private readonly AppDbContext _context;

    public ReglasMembresia(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Cancelada y Suspendida son estados manuales.</summary>
    public static bool EsEstadoManual(EstadoMembresia estado)
    {
        return estado == EstadoMembresia.Cancelada ||
               estado == EstadoMembresia.Suspendida;
    }

    /// <summary>
    /// Recalcula el estado según las fechas. Los estados
    /// manuales (Cancelada/Suspendida) no se modifican.
    /// </summary>
    public static void RecalcularEstado(
        Membresia membresia,
        DateTime hoy)
    {
        if (EsEstadoManual(membresia.Estado))
        {
            return;
        }

        if (membresia.FechaFin.Date < hoy)
        {
            membresia.Estado = EstadoMembresia.Vencida;
        }
        else if (membresia.FechaInicio.Date <= hoy &&
                 membresia.FechaFin.Date >= hoy)
        {
            membresia.Estado = EstadoMembresia.Activa;
        }
        else
        {
            membresia.Estado = EstadoMembresia.Pendiente;
        }
    }

    /// <summary>Precio del plan según los meses de diferencia.</summary>
    public static decimal CalcularPrecioSegunDuracion(
        Plan plan,
        DateTime fechaInicio,
        DateTime fechaFin)
    {
        if (plan == null)
        {
            return 0m;
        }

        var diferenciaMeses =
            (fechaFin.Year - fechaInicio.Year) * 12 +
            (fechaFin.Month - fechaInicio.Month);

        return diferenciaMeses switch
        {
            1 => plan.Precio1Mes,
            3 => plan.Precio3Meses,
            6 => plan.Precio6Meses,
            12 => plan.Precio12Meses,
            _ => plan.Precio,
        };
    }

    // =========================================================
    // MEMBRESÍAS RECHAZADAS
    // Una membresía se considera rechazada si tiene al menos un
    // pago RECHAZADO y ningún pago APROBADO. Se excluye del
    // control de solapamiento para permitir otra contratación.
    // =========================================================

    public async Task<HashSet<int>> ObtenerRechazadasIdsAsync()
    {
        var aprobadas = await _context.Pagos
            .Where(p => p.Estado == EstadoPago.Aprobado)
            .Select(p => p.MembresiaId)
            .Distinct()
            .ToListAsync();

        var aprobadasSet = new HashSet<int>(aprobadas);

        var rechazadas = await _context.Pagos
            .Where(p => p.Estado == EstadoPago.Rechazado)
            .Select(p => p.MembresiaId)
            .Distinct()
            .ToListAsync();

        return new HashSet<int>(
            rechazadas.Where(id => !aprobadasSet.Contains(id))
        );
    }

    /// <summary>
    /// Detecta superposición con membresías activas o pendientes
    /// del socio (excluye canceladas, vencidas y rechazadas).
    /// </summary>
    public async Task<bool> HaySolapamientoAsync(
        int socioId,
        Membresia nueva,
        int? excluirId = null)
    {
        var rechazadas = await ObtenerRechazadasIdsAsync();

        return await _context.Membresias
            .AnyAsync(m =>
                m.SocioId == socioId &&
                (excluirId == null || m.Id != excluirId) &&
                !rechazadas.Contains(m.Id) &&
                m.Estado != EstadoMembresia.Cancelada &&
                m.Estado != EstadoMembresia.Vencida &&
                m.FechaInicio.Date <= nueva.FechaFin.Date &&
                m.FechaFin.Date >= nueva.FechaInicio.Date);
    }
}
