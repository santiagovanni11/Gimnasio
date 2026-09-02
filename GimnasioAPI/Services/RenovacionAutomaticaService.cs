using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

public class RenovacionAutomaticaService
{
    private readonly AppDbContext _context;

    public RenovacionAutomaticaService(AppDbContext context) => _context = context;

    public async Task<int> ProcesarRenovacionesPendientes()
    {
        var hoy = DateOnly.FromDateTime(DateTime.Today);
        var membresias = await _context.Membresias
            .Include(m => m.Plan)
            .Include(m => m.MetodoPagoAlmacenado)
            .Where(m => m.RenovacionAutomatica
                && m.Estado == EstadoMembresia.Activa
                && m.MetodoPagoAlmacenado != null
                && m.MetodoPagoAlmacenado.Activo
                && m.FechaFin <= hoy.ToDateTime(TimeOnly.MinValue)
                    .AddDays(7))
            .ToListAsync();

        var procesadas = 0;
        foreach (var m in membresias)
        {
            if (!await Renovar(m)) continue;
            procesadas++;
        }

        await _context.SaveChangesAsync();
        return procesadas;
    }

    private async Task<bool> Renovar(Membresia membresia)
    {
        var meses = CalcularDuracionMeses(membresia);
        if (meses <= 0) return false;

        var inicio = membresia.FechaFin.AddDays(1);
        var fin = inicio.AddMonths(meses).AddDays(-1);
        var precio = membresia.Plan.Precio;

        var nueva = new Membresia
        {
            SocioId = membresia.SocioId,
            PlanId = membresia.PlanId,
            FechaInicio = inicio,
            FechaFin = fin,
            PrecioAplicado = precio,
            Estado = EstadoMembresia.Activa,
            RenovacionAutomatica = true,
            MetodoPagoAlmacenadoId = membresia.MetodoPagoAlmacenadoId,
            UltimaRenovacion = DateTime.UtcNow,
        };

        _context.Membresias.Add(nueva);

        // El período vigente ya fue renovado: se desactiva su flag
        // para que el job no genere renovaciones duplicadas en las
        // corridas siguientes (la renovación nueva lleva el flag).
        membresia.RenovacionAutomatica = false;

        if (precio > 0)
        {
            // Se persiste la renovación para obtener su Id y poder
            // vincular el débito automático del período nuevo.
            await _context.SaveChangesAsync();

            // Débito automático de la tarjeta almacenada: se registra
            // como pago aprobado del nuevo período, sin pasar por Pagos.
            _context.Pagos.Add(new Pago
            {
                MembresiaId = nueva.Id,
                Monto = precio,
                FormaPago = FormaPago.TarjetaCredito,
                Estado = EstadoPago.Aprobado,
                FechaPago = DateTime.UtcNow,
                Referencia = $"AUTO-{nueva.Id}",
                Observaciones = "Débito automático por renovación",
                RegistradoPor = "sistema-renovacion",
            });
        }

        return true;
    }

    private static int CalcularDuracionMeses(Membresia m)
    {
        // Mantiene la duración exacta del período anterior
        // (1 mes, 2 meses, 3 meses, ...) para renovar igual.
        return (m.FechaFin.Year - m.FechaInicio.Year) * 12
            + m.FechaFin.Month - m.FechaInicio.Month + 1;
    }
}
