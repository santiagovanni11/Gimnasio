using GimnasioAPI.Data;
using GimnasioAPI.Models;
using System.Security.Claims;

namespace GimnasioAPI.Services;

/// <summary>
/// Acciones auditables sobre cuentas de usuario.
/// </summary>
public static class AccionesAuditoriaUsuario
{
    public const string Creacion = "Creación";
    public const string CambioRol = "Cambio de rol";
    public const string CambioEstado = "Cambio de estado";
    public const string ResetPassword = "Reset de contraseña";
    public const string CambioPasswordPropio =
        "Cambio de contraseña propia";
    public const string Actualizacion = "Actualización";
    public const string Eliminacion = "Eliminación";

    // Accesos
    public const string AccesoExitoso = "Acceso exitoso";
    public const string AccesoFallido = "Intento fallido";
    public const string Desbloqueo = "Desbloqueo";
}

/// <summary>
/// Graba la auditoría de mutaciones de cuentas. Identifica al
/// actor a partir del token JWT (HttpContext actual).
/// </summary>
public class AuditoriaUsuariosService
{
    private readonly IHttpContextAccessor _http;

    public AuditoriaUsuariosService(IHttpContextAccessor http)
    {
        _http = http;
    }

    /// <summary>Actor autenticado de la request actual.</summary>
    private (int? Id, string? Email) ObtenerActor()
    {
        var user = _http.HttpContext?.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            return (null, null);
        }

        var idTexto = user.FindFirstValue(
            ClaimTypes.NameIdentifier);

        var email = user.FindFirstValue(ClaimTypes.Email);

        return (int.TryParse(idTexto, out var id) ? id : null,
                email);
    }

    /// <summary>
    /// Email del actor autenticado, para firmar registros
    /// (historial de precios, pagos). Con fallback al nombre
    /// de la identidad y, por último, "desconocido".
    /// </summary>
    public string ObtenerEmailActor()
    {
        var user = _http.HttpContext?.User;

        return user?.FindFirst(ClaimTypes.Email)?.Value
               ?? user?.Identity?.Name
               ?? "desconocido";
    }

    /// <summary>Agrega un registro y persiste los cambios.</summary>
    public async Task RegistrarAsync(
        AppDbContext context,
        string accion,
        Usuario objetivo,
        string? detalle = null)
    {
        var (actorId, actorEmail) = ObtenerActor();

        context.AuditoriaUsuarios.Add(new AuditoriaUsuario
        {
            Accion = accion,
            UsuarioId = objetivo.Id,
            EmailUsuario = objetivo.Email,
            RealizadoPorId = actorId,
            RealizadoPorEmail = actorEmail,
            Detalle = detalle,
            FechaUtc = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
