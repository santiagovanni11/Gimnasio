using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Xunit;

namespace GimnasioAPI.Tests;

/// <summary>
/// Cobertura de las reglas de planes: nombre, precio base y
/// el escalón ascendente de precios (1 &lt; 3 &lt; 6 &lt; 12 meses).
/// </summary>
public class PlanesValidacionesTests
{
    private static Plan PlanValido() => new Plan
    {
        Nombre = "Plan Test",
        Precio = 0,
        Precio1Mes = 1000,
        Precio3Meses = 2500,
        Precio6Meses = 4500,
        Precio12Meses = 8000,
    };

    [Fact]
    public void ValidarPlan_NombreVacio_DevuelveError()
    {
        var plan = PlanValido();
        plan.Nombre = "   ";

        Assert.NotNull(PlanesValidaciones.ValidarPlan(plan));
    }

    [Fact]
    public void ValidarPlan_PrecioBaseNegativo_DevuelveError()
    {
        var plan = PlanValido();
        plan.Precio = -1;

        Assert.NotNull(PlanesValidaciones.ValidarPlan(plan));
    }

    [Fact]
    public void ValidarPlan_Valido_DevuelveNull()
    {
        Assert.Null(PlanesValidaciones.ValidarPlan(PlanValido()));
    }

    [Theory]
    [InlineData(0, 2500, 4500, 8000)]
    [InlineData(1000, 1000, 4500, 8000)]
    [InlineData(1000, 2500, 2500, 8000)]
    [InlineData(1000, 2500, 4500, 4500)]
    public void ValidarEscalonPrecios_EscalonRoto_DevuelveError(
        decimal m1, decimal m3, decimal m6, decimal m12)
    {
        Assert.NotNull(
            PlanesValidaciones.ValidarEscalonPrecios(m1, m3, m6, m12));
    }

    [Fact]
    public void ValidarEscalonPrecios_TodosCrecientes_DevuelveNull()
    {
        Assert.Null(
            PlanesValidaciones.ValidarEscalonPrecios(
                1000, 2500, 4500, 8000));
    }
}
