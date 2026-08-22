using GimnasioAPI.Services;

namespace GimnasioAPI.Tests;

public class CredencialesValidatorTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void ValidarEmail_EmailVacio_RetornaError(string? email)
    {
        var resultado = CredencialesValidator.ValidarEmail(email);

        Assert.False(string.IsNullOrEmpty(resultado));
    }

    [Fact]
    public void ValidarEmail_EmailValido_RetornaVacio()
    {
        var resultado = CredencialesValidator.ValidarEmail("usuario@gimnasio.com");

        Assert.Equal("", resultado);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void ValidarPassword_PasswordVacia_RetornaError(string? password)
    {
        var resultado = CredencialesValidator.ValidarPassword(password);

        Assert.False(string.IsNullOrEmpty(resultado));
    }

    [Fact]
    public void ValidarPassword_PasswordCorta_RetornaError()
    {
        var resultado = CredencialesValidator.ValidarPassword("abc12");

        Assert.Contains("al menos", resultado);
    }

    [Fact]
    public void ValidarPassword_PasswordValida_RetornaVacio()
    {
        var resultado = CredencialesValidator.ValidarPassword("clave-segura-123");

        Assert.Equal("", resultado);
    }

    [Fact]
    public void LargoMinimoPassword_EsSeis()
    {
        Assert.Equal(6, CredencialesValidator.LargoMinimoPassword);
    }
}
