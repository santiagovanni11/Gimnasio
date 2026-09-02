using GimnasioAPI.Data;
using GimnasioAPI.Models;
using System.Security.Claims;

namespace GimnasioAPI.Services;

/// <summary>Acciones auditables sobre membresías.</summary>
public static class AccionesAuditoriaMembresia
{
    public const string Alta = "Alta";
    public const string Renovacion = "Renovación";
    public const string Edicion = "Edición";
    public const string Suspencion = "Suspensión";
    public const string Reactivacion = "Reactivación";
    public const string Cancelacion = "Cancelación";
    public const string Eliminacion = "Eliminación";
}

/// <summary>
/// Graba la auditoría de membresías. Identifica al actor desde
/// el token JWT (HttpContext actual), como AuditoriaUsuarios.
/// </summary>
public class AuditoriaMembresiasService
{
    private readonly IHttpContextAccessor _http;

    public AuditoriaMembresiasService(IHttpContextAccessor http)
    {
        _http = http;
    }

    private (int? Id, string? Email) ObtenerActor()
    {
        var user = _http.HttpContext?.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            return (null, null);
        }

        var idTexto = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = user.FindFirstValue(ClaimTypes.Email);

        return (int.TryParse(idTexto, out var id) ? id : null, email);
    }

    public async Task RegistrarAsync(
        AppDbContext context,
        string accion,
        Membresia membresia,
        string? detalle = null)
    {
        var (actorId, actorEmail) = ObtenerActor();

        context.AuditoriaMembresias.Add(new AuditoriaMembresia
        {
            Accion = accion,
            MembresiaId = membresia.Id,
            SocioId = membresia.SocioId,
            RealizadoPorId = actorId,
            RealizadoPorEmail = actorEmail,
            Detalle = detalle,
            FechaUtc = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
