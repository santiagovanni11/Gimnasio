using GimnasioAPI.Data;
using GimnasioAPI.Models;
using System.Security.Claims;

namespace GimnasioAPI.Services;

/// <summary>Acciones auditables sobre planes.</summary>
public static class AccionesAuditoriaPlan
{
    public const string Alta = "Alta";
    public const string Edicion = "Edición";
    public const string PausaVenta = "Pausa de venta";
    public const string ReactivacionVenta = "Reactivación de venta";
    public const string Eliminacion = "Eliminación";
}

/// <summary>
/// Graba la auditoría de planes. Identifica al actor desde el
/// token JWT (HttpContext actual), como AuditoriaMembresias.
/// </summary>
public class AuditoriaPlanesService
{
    private readonly IHttpContextAccessor _http;

    public AuditoriaPlanesService(IHttpContextAccessor http)
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
        Plan plan,
        string? detalle = null)
    {
        var (actorId, actorEmail) = ObtenerActor();

        context.AuditoriaPlanes.Add(new AuditoriaPlan
        {
            Accion = accion,
            PlanId = plan.Id,
            PlanNombre = plan.Nombre,
            RealizadoPorId = actorId,
            RealizadoPorEmail = actorEmail,
            Detalle = detalle,
            FechaUtc = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }
}
