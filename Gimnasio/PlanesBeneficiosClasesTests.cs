using GimnasioAPI.Controllers;
using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GimnasioAPI.Tests;

/// <summary>
/// Verifica el alta de beneficios/clases por plan vía el
/// controlador real (sin auth: el atributo no corre en unit).
/// </summary>
public class PlanesBeneficiosClasesTests
{
    private class StubHttpAccessor : IHttpContextAccessor
    {
        public HttpContext? HttpContext { get; set; }
    }

    private static AppDbContext CrearContexto()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"planes_bc_{Guid.NewGuid()}")
            .Options;

        return new AppDbContext(options);
    }

    private static PlanesController CrearController(AppDbContext ctx)
    {
        var acc = new StubHttpAccessor();
        return new PlanesController(
            ctx,
            new AuditoriaUsuariosService(acc),
            new AuditoriaPlanesService(acc));
    }

    [Fact]
    public async Task Asignar_CreaAsociaciones()
    {
        var ctx = CrearContexto();
        var plan = new Plan
        {
            Nombre = "P",
            Precio1Mes = 1,
            Precio3Meses = 2,
            Precio6Meses = 3,
            Precio12Meses = 4,
        };
        var beneficio = new Beneficio { Nombre = "B" };
        var clase = new Clase { Nombre = "C" };
        ctx.Planes.Add(plan);
        ctx.Beneficios.Add(beneficio);
        ctx.Clases.Add(clase);
        await ctx.SaveChangesAsync();

        var ctrl = CrearController(ctx);

        var resultado = await ctrl.AsignarBeneficiosClases(
            plan.Id,
            new AsignarBeneficiosClasesDto
            {
                Beneficios = new List<int> { beneficio.Id },
                Clases = new List<int> { clase.Id },
            });

        Assert.IsType<NoContentResult>(resultado);
        Assert.Single(plan.PlanesBeneficios);
        Assert.Single(plan.PlanesClases);
        Assert.Equal(beneficio.Id, plan.PlanesBeneficios.First().BeneficioId);
    }

    [Fact]
    public async Task Asignar_ReemplazaAsociacionesPrevias()
    {
        var ctx = CrearContexto();
        var plan = new Plan
        {
            Nombre = "P",
            Precio1Mes = 1,
            Precio3Meses = 2,
            Precio6Meses = 3,
            Precio12Meses = 4,
        };
        var b1 = new Beneficio { Nombre = "B1" };
        var b2 = new Beneficio { Nombre = "B2" };
        ctx.Planes.Add(plan);
        ctx.Beneficios.AddRange(b1, b2);
        await ctx.SaveChangesAsync();

        var ctrl = CrearController(ctx);

        await ctrl.AsignarBeneficiosClases(
            plan.Id,
            new AsignarBeneficiosClasesDto
            {
                Beneficios = new List<int> { b1.Id },
                Clases = new List<int>(),
            });
        await ctrl.AsignarBeneficiosClases(
            plan.Id,
            new AsignarBeneficiosClasesDto
            {
                Beneficios = new List<int> { b2.Id },
                Clases = new List<int>(),
            });

        Assert.Single(plan.PlanesBeneficios);
        Assert.Equal(b2.Id, plan.PlanesBeneficios.First().BeneficioId);
    }

    [Fact]
    public async Task Asignar_PlanInexistente_NotFound()
    {
        var ctx = CrearContexto();
        var ctrl = CrearController(ctx);

        var resultado = await ctrl.AsignarBeneficiosClases(
            999,
            new AsignarBeneficiosClasesDto
            {
                Beneficios = new List<int>(),
                Clases = new List<int>(),
            });

        Assert.IsType<NotFoundObjectResult>(resultado);
    }

    [Fact]
    public async Task Referencias_DevuelveCatalogoActivo()
    {
        var ctx = CrearContexto();
        ctx.Beneficios.Add(new Beneficio { Nombre = "B", Activo = true });
        ctx.Clases.Add(new Clase { Nombre = "C", Activa = true });
        await ctx.SaveChangesAsync();

        var ctrl = CrearController(ctx);

        var resultado = await ctrl.GetReferencias();
        var ok = Assert.IsType<OkObjectResult>(resultado);

        Assert.NotNull(ok.Value);
    }
}
