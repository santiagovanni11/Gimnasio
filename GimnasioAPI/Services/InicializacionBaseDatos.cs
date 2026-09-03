using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Settings;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

/// <summary>
/// Prepara la base de datos en el arranque de la aplicación:
/// aplica las migraciones pendientes (crea las tablas si aún no
/// existen) y garantiza que los roles del sistema estén creados.
/// Es idempotente: si ya todo existe, no hace nada.
/// </summary>
public static class InicializacionBaseDatos
{
    /// <summary>
    /// Aplica migraciones y crea los roles base. Se invoca una
    /// sola vez durante el arranque.
    /// </summary>
    public static async Task InicializarAsync(
        IServiceScope scope,
        IConfiguration configuracion,
        ILogger logger)
    {
        var contexto = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        await contexto.Database.MigrateAsync();

        await AsegurarRolesAsync(contexto);

        await AsegurarAdministradorInicialAsync(
            contexto, configuracion, logger);
    }

    private static async Task AsegurarRolesAsync(
        AppDbContext contexto)
    {
        var definidos = new (string Nombre, string Descripcion)[]
        {
            (RolesGimnasio.Administrador,
                "Acceso total al sistema."),
            (RolesGimnasio.Recepcionista,
                "Gestión de socios, membresías y pagos."),
            (RolesGimnasio.Profesor,
                "Consulta de socios y clases."),
        };

        var nombres = definidos.Select(d => d.Nombre).ToArray();
        var existentes = await contexto.Roles
            .Where(r => nombres.Contains(r.Nombre))
            .ToDictionaryAsync(r => r.Nombre);

        foreach (var (nombre, descripcion) in definidos)
        {
            if (existentes.ContainsKey(nombre))
            {
                continue;
            }

            contexto.Roles.Add(new Rol
            {
                Nombre = nombre,
                Descripcion = descripcion,
                Activo = true
            });
        }

        await contexto.SaveChangesAsync();
    }

    /// <summary>
    /// Crea un administrador inicial si se configuran las
    /// variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD. Si la
    /// cuenta ya existe o no se configuraron, no hace nada.
    /// </summary>
    private static async Task AsegurarAdministradorInicialAsync(
        AppDbContext contexto,
        IConfiguration configuracion,
        ILogger logger)
    {
        var email = configuracion["ADMIN_EMAIL"] ?? configuracion["Admin:Email"];
        var password = configuracion["ADMIN_PASSWORD"] ?? configuracion["Admin:Password"];

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        email = email.Trim();

        var yaExiste = await contexto.Usuarios.AnyAsync(u =>
            u.Email.ToLower() == email.ToLower());

        if (yaExiste)
        {
            return;
        }

        var rolAdmin = await contexto.Roles.FirstOrDefaultAsync(
            r => r.Nombre == RolesGimnasio.Administrador);

        if (rolAdmin == null)
        {
            return;
        }

        contexto.Usuarios.Add(new Usuario
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Nombre = configuracion["ADMIN_NAME"] ?? "Administrador",
            RolId = rolAdmin.Id,
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        });

        await contexto.SaveChangesAsync();
        logger.LogInformation(
            "Administrador inicial creado: {Email}", email);
    }
}
