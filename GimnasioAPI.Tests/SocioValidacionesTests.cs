using GimnasioAPI.Models;
using GimnasioAPI.Services;

namespace GimnasioAPI.Tests;

public class SocioValidacionesTests
{
    private static Socio SocioValido() => new()
    {
        Nombre = "Juan",
        Apellido = "Pérez",
        DNI = "34567890",
        FechaNacimiento = new DateTime(1995, 5, 10),
        Telefono = "2664567890",
        Email = "juan.perez@mail.com",
    };

    [Fact]
    public void ValidarDatos_SocioValido_RetornaNull()
    {
        var resultado = SocioValidaciones.ValidarDatos(SocioValido());

        Assert.Null(resultado);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void ValidarDatos_SinNombre_RetornaError(string? nombre)
    {
        var socio = SocioValido();
        socio.Nombre = nombre!;

        var resultado = SocioValidaciones.ValidarDatos(socio);

        Assert.Contains("nombre", resultado, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ValidarDatos_NombreConNumeros_RetornaError()
    {
        var socio = SocioValido();
        socio.Nombre = "Juan123";

        var resultado = SocioValidaciones.ValidarDatos(socio);

        Assert.NotNull(resultado);
        Assert.Contains("letras", resultado);
    }

    [Fact]
    public void ValidarDatos_NombreConTildes_Aceptado()
    {
        var socio = SocioValido();
        socio.Nombre = "José María";

        var resultado = SocioValidaciones.ValidarDatos(socio);

        Assert.Null(resultado);
    }

    [Theory]
    [InlineData("3456789")]   // 7 dígitos: válido
    [InlineData("34567890")]  // 8 dígitos: válido
    [InlineData("345678")]    // 6 dígitos: inválido
    [InlineData("345678901")] // 9 dígitos: inválido
    [InlineData("34.567.890")] // con puntos: inválido
    public void ValidarDatos_DNI_ValidaFormato(string dni)
    {
        var socio = SocioValido();
        socio.DNI = dni;

        var resultado = SocioValidaciones.ValidarDatos(socio);
        var esValido = dni.Length is >= 7 and <= 8 && dni.All(char.IsDigit);

        if (esValido)
        {
            Assert.Null(resultado);
        }
        else
        {
            Assert.NotNull(resultado);
            Assert.Contains("DNI", resultado);
        }
    }

    [Fact]
    public void ValidarDatos_EmailInvalido_RetornaError()
    {
        var socio = SocioValido();
        socio.Email = "sin-arroba";

        var resultado = SocioValidaciones.ValidarDatos(socio);

        Assert.NotNull(resultado);
        Assert.Contains("email", resultado, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void ValidarDatos_TelefonoCorto_RetornaError()
    {
        var socio = SocioValido();
        socio.Telefono = "1234567"; // 7 dígitos < mínimo 8

        var resultado = SocioValidaciones.ValidarDatos(socio);

        Assert.NotNull(resultado);
        Assert.Contains("teléfono", resultado, StringComparison.OrdinalIgnoreCase);
    }
}
