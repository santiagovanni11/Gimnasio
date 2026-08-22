using System.Threading.RateLimiting;

namespace GimnasioAPI.Extensions;

/// <summary>
/// Limitador de tasa para los endpoints públicos de
/// autenticación (login y registro). Complementa el bloqueo
/// por cuenta del LoginGuardService: protege contra fuerza
/// bruta distribuida sobre distintos emails desde una misma IP.
/// </summary>
public static class ConfiguracionRateLimiter
{
    public const string PoliticaAuth = "auth";

    private const int SolicitudesPorVentana = 10;
    private const int MinutosVentana = 1;

    public static IServiceCollection AgregarLimitadorAuth(
        this IServiceCollection services)
    {
        services.AddRateLimiter(opciones =>
        {
            opciones.RejectionStatusCode =
                StatusCodes.Status429TooManyRequests;

            opciones.OnRejected = async (contexto, _) =>
            {
                contexto.HttpContext.Response.ContentType =
                    "text/plain; charset=utf-8";

                await contexto.HttpContext.Response.WriteAsync(
                    "Demasiadas solicitudes. " +
                    "Esperá un minuto y volvé a intentar.");
            };

            // Ventana fija por IP.
            opciones.AddPolicy(
                PoliticaAuth,
                httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        Particion(httpContext),
                        _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = SolicitudesPorVentana,
                            Window =
                                TimeSpan.FromMinutes(MinutosVentana),
                            QueueLimit = 0
                        }));
        });

        return services;
    }

    /// <summary>Clave de partición: IP del cliente.</summary>
    private static string Particion(HttpContext httpContext)
    {
        return httpContext.Connection.RemoteIpAddress?.ToString()
               ?? "desconocida";
    }
}
