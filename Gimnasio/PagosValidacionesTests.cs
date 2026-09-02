using GimnasioAPI.Services;
using Xunit;

namespace GimnasioAPI.Tests;

/// <summary>
/// Regla de negocio del monto de un pago (PagosValidaciones).
/// </summary>
public class PagosValidacionesTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(-50)]
    public void Monto_NoPositivo_Error(decimal monto)
    {
        Assert.NotNull(PagosValidaciones.ValidarMonto(monto, 100));
    }

    [Fact]
    public void Monto_SuperaPrecio_Error()
    {
        Assert.NotNull(PagosValidaciones.ValidarMonto(150, 100));
    }

    [Fact]
    public void Monto_ExactoAlPrecio_Valido()
    {
        Assert.Null(PagosValidaciones.ValidarMonto(100, 100));
    }

    [Fact]
    public void Monto_MenorAlPrecio_Valido()
    {
        Assert.Null(PagosValidaciones.ValidarMonto(50, 100));
    }
}
