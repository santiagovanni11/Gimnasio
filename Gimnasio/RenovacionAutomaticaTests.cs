using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Tests;

public class RenovacionAutomaticaTests
{
    [Fact]
    public async Task ProcesarDebitaLaTarjeta_YPagaElNuevoPeriodo()
    {
        var context = CrearContexto();
        SeDebePoblarBase(context,
            inicio: new DateTime(2026, 1, 1),
            fin: new DateTime(2026, 1, 31));

        var servicio = new RenovacionAutomaticaService(context);
        var procesadas = await servicio.ProcesarRenovacionesPendientes();

        Assert.Equal(1, procesadas);

        var renovacion = context.Membresias.Single(m => m.Id != 1);

        Assert.Equal(EstadoMembresia.Activa, renovacion.Estado);
        Assert.True(renovacion.RenovacionAutomatica);
        Assert.Equal(1, renovacion.MetodoPagoAlmacenadoId);
        // Vigencia nueva: arranca al día siguiente del vencimiento.
        Assert.Equal(new DateTime(2026, 2, 1), renovacion.FechaInicio);

        var pago = Assert.Single(context.Pagos);
        Assert.Equal(renovacion.Id, pago.MembresiaId);
        Assert.Equal(EstadoPago.Aprobado, pago.Estado);
        Assert.Equal(5000m, pago.Monto);

        // El período vigente ya fue renovado: no se vuelve a procesar.
        var original = context.Membresias.Single(m => m.Id == 1);
        Assert.False(original.RenovacionAutomatica);
    }

    [Fact]
    public async Task RespetaLaDuracionExacta_DeLaMembresiaActual()
    {
        var context = CrearContexto();
        // Membresía de 2 meses (ene-feb).
        SeDebePoblarBase(context,
            inicio: new DateTime(2026, 1, 1),
            fin: new DateTime(2026, 2, 28));

        var servicio = new RenovacionAutomaticaService(context);
        await servicio.ProcesarRenovacionesPendientes();

        var renovacion = context.Membresias.Single(m => m.Id != 1);

        // También dura exactamente 2 meses, arrancando el día siguiente.
        Assert.Equal(new DateTime(2026, 3, 1), renovacion.FechaInicio);
        Assert.Equal(new DateTime(2026, 4, 30), renovacion.FechaFin);
    }

    [Fact]
    public async Task SinTarjetaValida_NoRenueva()
    {
        var context = CrearContexto();
        SeDebePoblarBase(context,
            inicio: new DateTime(2026, 1, 1),
            fin: new DateTime(2026, 1, 31),
            conMetodoPago: false);

        var servicio = new RenovacionAutomaticaService(context);
        var procesadas = await servicio.ProcesarRenovacionesPendientes();

        Assert.Equal(0, procesadas);
        Assert.Empty(context.Membresias.Where(m => m.Id != 1));
    }

    private static void SeDebePoblarBase(
        AppDbContext context,
        DateTime inicio,
        DateTime fin,
        bool conMetodoPago = true)
    {
        context.Socios.Add(new Socio
        {
            Id = 1,
            Nombre = "Ana",
            Apellido = "Perez",
            DNI = "1",
            FechaNacimiento = new DateTime(2000, 1, 1),
            Telefono = "1",
            Email = "a@b.c",
            Activo = true,
        });

        context.Planes.Add(new Plan
        {
            Id = 1,
            Nombre = "Premium",
            Precio = 5000m,
            Activo = true,
        });

        var metodoId = conMetodoPago ? 1 : (int?)null;
        if (conMetodoPago)
        {
            context.MetodosPagoAlmacenados.Add(new MetodoPagoAlmacenado
            {
                Id = 1,
                SocioId = 1,
                Marca = "Visa",
                UltimosCuatro = "1234",
                Token = "tok",
                MesVencimiento = 12,
                AnioVencimiento = 2030,
                Activo = true,
            });
        }

        context.Membresias.Add(new Membresia
        {
            Id = 1,
            SocioId = 1,
            PlanId = 1,
            FechaInicio = inicio,
            FechaFin = fin,
            PrecioAplicado = 5000m,
            Estado = EstadoMembresia.Activa,
            RenovacionAutomatica = true,
            MetodoPagoAlmacenadoId = metodoId,
        });

        context.SaveChanges();
    }

    private static AppDbContext CrearContexto()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }
}
