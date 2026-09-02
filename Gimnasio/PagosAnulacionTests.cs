using GimnasioAPI.Controllers;
using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GimnasioAPI.Tests;

/// <summary>
/// Anulación de pagos (DELETE): motivo obligatorio, anulación
/// terminal y registro del motivo.
/// </summary>
public class PagosAnulacionTests
{
    private class StubHttp : IHttpContextAccessor
    {
        public HttpContext? HttpContext { get; set; }
    }

    private static AppDbContext Ctx()
    {
        var o = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"pagos_{Guid.NewGuid()}").Options;
        return new AppDbContext(o);
    }

    private static PagosController Controller(AppDbContext ctx) =>
        new PagosController(ctx, new AuditoriaUsuariosService(new StubHttp()));

    [Fact]
    public async Task SinMotivo_BadRequest()
    {
        var ctx = Ctx();
        var p = new Pago { Monto = 10, Estado = EstadoPago.Pendiente };
        ctx.Pagos.Add(p);
        await ctx.SaveChangesAsync();

        var res = await Controller(ctx).DeletePago(p.Id, "");
        Assert.IsType<BadRequestObjectResult>(res);
    }

    [Fact]
    public async Task YaAnulado_BadRequest()
    {
        var ctx = Ctx();
        var p = new Pago { Monto = 10, Estado = EstadoPago.Anulado };
        ctx.Pagos.Add(p);
        await ctx.SaveChangesAsync();

        var res = await Controller(ctx).DeletePago(p.Id, "otro motivo");
        Assert.IsType<BadRequestObjectResult>(res);
    }

    [Fact]
    public async Task Valido_AnulaConMotivo()
    {
        var ctx = Ctx();
        var p = new Pago { Monto = 10, Estado = EstadoPago.Pendiente };
        ctx.Pagos.Add(p);
        await ctx.SaveChangesAsync();

        var res = await Controller(ctx).DeletePago(p.Id, "error de cobro");
        Assert.IsType<NoContentResult>(res);

        var enDb = await ctx.Pagos.FindAsync(p.Id);
        Assert.Equal(EstadoPago.Anulado, enDb!.Estado);
        Assert.Equal("error de cobro", enDb.MotivoAnulacion);
        Assert.NotNull(enDb.AnuladoPor);
        Assert.NotNull(enDb.FechaAnulacion);
    }
}
