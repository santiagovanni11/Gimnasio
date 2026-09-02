using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

/// <summary>
/// Reglas de negocio de membresías: recálculo automático de
/// estado, precio por duración y control de solapamiento.
/// </summary>
public partial class ReglasMembresia
{
    private readonly AppDbContext _context;

    public ReglasMembresia(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Cancelada y Suspendida son estados manuales.</summary>
    private static bool EsEstadoManual(EstadoMembresia estado)
        => estado == EstadoMembresia.Cancelada ||
           estado == EstadoMembresia.Suspendida;

    /// <summary>
    /// Recalcula el estado según fechas y pago. Estados manuales
    /// no se modifican.
    /// </summary>
    public static void RecalcularEstado(
        Membresia membresia,
        DateTime hoy,
        bool? tienePagoAprobado = null)
    {
        if (EsEstadoManual(membresia.Estado)) return;

        if (membresia.FechaFin.Date < hoy)
        {
            membresia.Estado = EstadoMembresia.Vencida;
        }
        else if (membresia.FechaInicio.Date <= hoy &&
                 membresia.FechaFin.Date >= hoy)
        {
            membresia.Estado = tienePagoAprobado == false
                ? EstadoMembresia.Pendiente
                : EstadoMembresia.Activa;
        }
        else
        {
            membresia.Estado = EstadoMembresia.Pendiente;
        }
    }

    /// <summary>
    /// ¿Tiene al menos un pago APROBADO en el período vigente?
    /// </summary>
    public async Task<bool> TienePagoAprobadoEnPeriodoAsync(
        int membresiaId,
        DateTime? sello)
    {
        var consulta = _context.Pagos.Where(p =>
            p.MembresiaId == membresiaId &&
            p.Estado == EstadoPago.Aprobado);

        if (sello is DateTime s)
        {
            consulta = consulta.Where(
                p => p.FechaPago.Date >= s.Date);
        }

        return await consulta.AnyAsync();
    }

    /// <summary>Precio del plan según los meses de diferencia.</summary>
    public static decimal CalcularPrecioSegunDuracion(
        Plan plan,
        DateTime fechaInicio,
        DateTime fechaFin)
    {
        if (plan == null) return 0m;

        var meses = (fechaFin.Year - fechaInicio.Year) * 12 +
                    (fechaFin.Month - fechaInicio.Month);

        if (fechaFin < fechaInicio.AddMonths(meses))
            meses--;

        return meses switch
        {
            1  => plan.Precio1Mes,
            3  => plan.Precio3Meses,
            6  => plan.Precio6Meses,
            12 => plan.Precio12Meses,
            _  => plan.Precio * Math.Max(meses, 1),
        };
    }

    /// <summary>
    /// IDs de membresías rechazadas (pagos rechazados y sin
    /// aprobados). Se excluyen del solapamiento.
    /// </summary>
    private async Task<HashSet<int>> ObtenerRechazadasIdsAsync()
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
            rechazadas.Where(id => !aprobadasSet.Contains(id)));
    }

    /// <summary>
    /// Detecta superposición con membresías vigentes del socio.
    /// </summary>
    private async Task<bool> HaySolapamientoAsync(
        int socioId,
        Membresia nueva,
        int? excluirId = null)
    {
        var rechazadas = await ObtenerRechazadasIdsAsync();

        return await _context.Membresias.AnyAsync(m =>
            m.SocioId == socioId &&
            (excluirId == null || m.Id != excluirId) &&
            !rechazadas.Contains(m.Id) &&
            m.Estado != EstadoMembresia.Cancelada &&
            m.Estado != EstadoMembresia.Vencida &&
            m.FechaInicio.Date <= nueva.FechaFin.Date &&
            m.FechaFin.Date >= nueva.FechaInicio.Date);
    }
}
