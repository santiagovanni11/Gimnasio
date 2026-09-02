using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using GimnasioAPI.Settings;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GimnasioAPI.Tests;

/// <summary>
/// Protección "nunca sin Administrador activo": el último
/// admin activo no debe poder ser desactivado/eliminado.
/// </summary>
public class AdministradorGuardTests
{
    private static AppDbContext Ctx()
    {
        var o = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"guard_{Guid.NewGuid()}").Options;
        return new AppDbContext(o);
    }

    private static async Task<(AppDbContext, Usuario)> SembrarAsync(
        string rol, bool activo)
    {
        var ctx = Ctx();
        var r = new Rol { Nombre = rol, Activo = true };
        ctx.Roles.Add(r);
        await ctx.SaveChangesAsync();
        var u = new Usuario
        {
            Email = $"{Guid.NewGuid()}@x.com",
            RolId = r.Id,
            Activo = activo,
            PasswordHash = "x",
        };
        ctx.Usuarios.Add(u);
        await ctx.SaveChangesAsync();
        return (ctx, u);
    }

    [Fact]
    public async Task UnicoAdminActivo_True()
    {
        var (ctx, u) = await SembrarAsync(RolesGimnasio.Administrador, true);
        Assert.True(await new AdministradorGuardService(ctx)
            .EsUltimoAdministradorActivoAsync(u));
    }

    [Fact]
    public async Task DosAdminsActivos_False()
    {
        var ctx = Ctx();
        var r = new Rol { Nombre = RolesGimnasio.Administrador, Activo = true };
        ctx.Roles.Add(r);
        await ctx.SaveChangesAsync();
        ctx.Usuarios.AddRange(
            new Usuario { Email = "a@x.com", RolId = r.Id, Activo = true, PasswordHash = "x" },
            new Usuario { Email = "b@x.com", RolId = r.Id, Activo = true, PasswordHash = "x" });
        await ctx.SaveChangesAsync();

        Assert.False(await new AdministradorGuardService(ctx)
            .EsUltimoAdministradorActivoAsync(ctx.Usuarios.Local.First()));
    }

    [Fact]
    public async Task UsuarioInactivo_False()
    {
        var (ctx, u) = await SembrarAsync(RolesGimnasio.Administrador, false);
        Assert.False(await new AdministradorGuardService(ctx)
            .EsUltimoAdministradorActivoAsync(u));
    }

    [Fact]
    public async Task NoEsAdmin_False()
    {
        var (ctx, u) = await SembrarAsync(RolesGimnasio.Recepcionista, true);
        Assert.False(await new AdministradorGuardService(ctx)
            .EsUltimoAdministradorActivoAsync(u));
    }
}
