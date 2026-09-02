using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using GimnasioAPI.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GimnasioAPI.Tests;

/// <summary>
/// Alta de cuentas (CreacionUsuariosService): valida credenciales,
/// evita duplicados y genera el hash de la contraseña.
/// </summary>
public class UsuariosServiciosTests
{
    private class StubHttp : IHttpContextAccessor
    {
        public HttpContext? HttpContext { get; set; }
    }

    private static AppDbContext Ctx()
    {
        var o = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"crear_{Guid.NewGuid()}").Options;
        return new AppDbContext(o);
    }

    private static async Task<(AppDbContext, int)> RolAdminAsync()
    {
        var ctx = Ctx();
        var rol = new Rol { Nombre = RolesGimnasio.Administrador, Activo = true };
        ctx.Roles.Add(rol);
        await ctx.SaveChangesAsync();
        return (ctx, rol.Id);
    }

    [Fact]
    public async Task EmailDuplicado_Error()
    {
        var (ctx, rolId) = await RolAdminAsync();
        ctx.Usuarios.Add(new Usuario
            { Email = "a@x.com", RolId = rolId, Activo = true, PasswordHash = "x" });
        await ctx.SaveChangesAsync();

        var res = await new CreacionUsuariosService(
            ctx, new AuditoriaUsuariosService(new StubHttp()))
            .CrearAsync(new CrearUsuarioDto
            {
                Email = "A@X.com",
                Password = "Passw0rd!",
                Nombre = "N",
                Apellido = "A",
                RolId = rolId,
            });

        Assert.NotNull(res.Error);
        Assert.Null(res.Usuario);
    }

    [Theory]
    [InlineData("", "Passw0rd!")]
    [InlineData("b@x.com", "123")]
    public async Task CredencialesInvalidas_Error(string email, string password)
    {
        var (ctx, rolId) = await RolAdminAsync();

        var res = await new CreacionUsuariosService(
            ctx, new AuditoriaUsuariosService(new StubHttp()))
            .CrearAsync(new CrearUsuarioDto
            {
                Email = email,
                Password = password,
                Nombre = "N",
                Apellido = "A",
                RolId = rolId,
            });

        Assert.NotNull(res.Error);
    }

    [Fact]
    public async Task Valido_CreaUsuarioActivoYHasheado()
    {
        var (ctx, rolId) = await RolAdminAsync();

        var res = await new CreacionUsuariosService(
            ctx, new AuditoriaUsuariosService(new StubHttp()))
            .CrearAsync(new CrearUsuarioDto
            {
                Email = "nuevo@x.com",
                Password = "Passw0rd!",
                Nombre = "N",
                Apellido = "A",
                RolId = rolId,
            });

        Assert.Null(res.Error);
        Assert.NotNull(res.Usuario);
        Assert.True(res.Usuario!.Activo);
        Assert.NotEqual("Passw0rd!", res.Usuario.PasswordHash);
    }
}
