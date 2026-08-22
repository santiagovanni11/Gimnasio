using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

/// <summary>
/// Regla de negocio: el sistema nunca debe quedarse sin un
/// Administrador activo. Centraliza esa protección para que
/// todos los endpoints de usuarios usen el mismo criterio.
/// </summary>
public class AdministradorGuardService
{
    private readonly AppDbContext _context;

    public AdministradorGuardService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Indica si el rol corresponde a Administrador.</summary>
    public Task<bool> EsRolAdministradorAsync(int rolId)
    {
        return _context.Roles
            .AnyAsync(r =>
                r.Id == rolId &&
                r.Nombre == "Administrador");
    }

    /// <summary>Cantidad de administradores activos de un rol.</summary>
    public Task<int> ContarAdministradoresActivosAsync(int rolId)
    {
        return _context.Usuarios
            .CountAsync(u =>
                u.RolId == rolId &&
                u.Activo);
    }

    /// <summary>
    /// Determina si el usuario es, hoy, el último Administrador
    /// activo del sistema. Si lo es, no puede desactivarse ni
    /// dejar de ser administrador.
    /// </summary>
    public async Task<bool> EsUltimoAdministradorActivoAsync(
        Usuario usuario)
    {
        if (!usuario.Activo)
        {
            return false;
        }

        if (!await EsRolAdministradorAsync(usuario.RolId))
        {
            return false;
        }

        var activos = await ContarAdministradoresActivosAsync(
            usuario.RolId);

        return activos <= 1;
    }
}
