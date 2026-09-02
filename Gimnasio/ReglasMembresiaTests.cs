using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Tests;

public class ReglasMembresiaTests
{
    private static Plan PlanPrueba() => new()
    {
        Nombre = "Premium",
        Precio = 10000m,
        Precio1Mes = 3000m,
        Precio3Meses = 8000m,
        Precio6Meses = 15000m,
        Precio12Meses = 28000m,
        Activo = true,
    };

    [Theory]
    [InlineData(1, 3000)]
    [InlineData(3, 8000)]
    [InlineData(6, 15000)]
    [InlineData(12, 28000)]
    [InlineData(2, 20000)]   // 2 meses -> proporcional (2 x base)
    [InlineData(4, 40000)]   // duración no tabulada -> proporcional
    public void CalcularPrecioSegunDuracion_MapeaCorrectamente(
        int meses, decimal esperado)
    {
        var plan = PlanPrueba();
        var ini = new DateTime(2026, 1, 1);
        var fin = ini.AddMonths(meses);

        var precio = ReglasMembresia.CalcularPrecioSegunDuracion(plan, ini, fin);

        Assert.Equal(esperado, precio);
    }

    [Theory]
    [InlineData(3, 8000)]  // 31ago -> 30nov = 3 meses exactos
    [InlineData(1, 3000)]  // 31ene -> 28feb = 1 mes exacto
    [InlineData(6, 15000)] // 31ago -> 28feb (año sig.) = 6 meses
    public void CalcularPrecioSegunDuracion_DiferenciaExacta_PorDia(
        int meses, decimal esperado)
    {
        var plan = PlanPrueba();
        var ini = new DateTime(2026, 8, 31);
        var fin = ini.AddMonths(meses);

        var precio = ReglasMembresia.CalcularPrecioSegunDuracion(plan, ini, fin);

        Assert.Equal(esperado, precio);
    }

    [Fact]
    public void CalcularPrecioSegunDuracion_PlanNulo_RetornaCero()
    {
        var ini = new DateTime(2026, 1, 1);
        var precio = ReglasMembresia.CalcularPrecioSegunDuracion(
            null, ini, ini.AddMonths(1));

        Assert.Equal(0m, precio);
    }

    [Fact]
    public void RecalcularEstado_Vencida_CuandoFinPasado()
    {
        var m = new Membresia
        {
            FechaInicio = new DateTime(2025, 1, 1),
            FechaFin = new DateTime(2025, 2, 1),
        };

        ReglasMembresia.RecalcularEstado(m, new DateTime(2026, 1, 1));

        Assert.Equal(EstadoMembresia.Vencida, m.Estado);
    }

    [Theory]
    [InlineData(1, 15, 10)]  // vigente
    [InlineData(2, 1, 1)]    // aún no inicia -> pendiente
    public void RecalcularEstado_ActivaOPendiente(int mesIni, int diaIni, int diaHoy)
    {
        var m = new Membresia
        {
            FechaInicio = new DateTime(2026, month: mesIni, day: diaIni),
            FechaFin = new DateTime(2026, 12, 31),
        };

        ReglasMembresia.RecalcularEstado(m, new DateTime(2026, 1, diaHoy));

        var esperado = diaHoy >= diaIni && mesIni <= 1
            ? EstadoMembresia.Activa
            : EstadoMembresia.Pendiente;
        Assert.Equal(esperado, m.Estado);
    }

    [Theory]
    [InlineData(false, EstadoMembresia.Pendiente)]
    [InlineData(true, EstadoMembresia.Activa)]
    public void RecalcularEstado_VigenteSegunPago(
        bool pagoAprobado, EstadoMembresia esperado)
    {
        var m = new Membresia
        {
            FechaInicio = new DateTime(2026, 1, 1),
            FechaFin = new DateTime(2026, 12, 31),
        };

        ReglasMembresia.RecalcularEstado(
            m,
            new DateTime(2026, 5, 1),
            tienePagoAprobado: pagoAprobado);

        Assert.Equal(esperado, m.Estado);
    }

    [Theory]
    [InlineData(EstadoMembresia.Cancelada)]
    [InlineData(EstadoMembresia.Suspendida)]
    public void RecalcularEstado_EstadoManual_NoSeModifica(
        EstadoMembresia manual)
    {
        var m = new Membresia
        {
            FechaInicio = new DateTime(2025, 1, 1),
            FechaFin = new DateTime(2025, 1, 1),
            Estado = manual,
        };

        ReglasMembresia.RecalcularEstado(m, new DateTime(2026, 1, 1));

        Assert.Equal(manual, m.Estado);
    }

    [Fact]
    public async Task ValidarParaAlta_Solapamiento_RetornaError()
    {
        var context = CrearContexto();
        context.Socios.Add(new Socio { Id = 1, Nombre = "A", Apellido = "B", DNI = "1", FechaNacimiento = new DateTime(2000, 1, 1), Telefono = "1", Email = "a@b.c", Activo = true });
        context.Planes.Add(new Plan { Id = 1, Nombre = "P", Activo = true });
        context.Membresias.Add(new Membresia
        {
            Id = 1,
            SocioId = 1,
            PlanId = 1,
            FechaInicio = new DateTime(2026, 1, 1),
            FechaFin = new DateTime(2026, 6, 30),
            Estado = EstadoMembresia.Activa,
        });
        await context.SaveChangesAsync();

        var reglas = new ReglasMembresia(context);
        var nueva = new Membresia
        {
            SocioId = 1,
            PlanId = 1,
            FechaInicio = new DateTime(2026, 3, 1),
            FechaFin = new DateTime(2026, 9, 1),
        };

        var (_, error) = await reglas.ValidarParaAltaOEdicionAsync(nueva);

        Assert.Contains("superpone", error, StringComparison.OrdinalIgnoreCase);
    }

    private static AppDbContext CrearContexto()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }
}
