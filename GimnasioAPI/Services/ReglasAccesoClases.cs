using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Reglas de acceso a clases según el plan de la membresía.
/// El acceso es POSITIVO: un socio puede inscribirse a clases
/// solo si el beneficio canónico "Acceso a clases" está asignado
/// a su plan. Si el plan NO incluye ese beneficio, el socio no
/// tiene acceso (el frontend lo oculta y la API lo rechaza).
/// </summary>
public static class ReglasAccesoClases
{
    /// <summary>Beneficio canónico que habilita el acceso a clases.</summary>
    public const string BeneficioAccesoAClases = "Acceso a clases";

    /// <summary>Normaliza un nombre de beneficio para comparar.</summary>
    internal static string Normalizar(string? nombre) =>
        (nombre ?? string.Empty).Trim().ToLowerInvariant();

    /// <summary>
    /// Indica si el plan NO incluye el beneficio "Acceso a clases"
    /// (es decir, el socio de ese plan no puede asistir a clases).
    /// </summary>
    public static bool PlanSinAccesoAClases(Plan plan)
    {
        if (plan?.PlanesBeneficios == null) return true;

        return !plan.PlanesBeneficios.Any(pb =>
            pb.Beneficio != null &&
            Normalizar(pb.Beneficio.Nombre) ==
                Normalizar(BeneficioAccesoAClases));
    }

    /// <summary>
    /// IDs de socios cuya membresía vigente tiene un plan SIN el
    /// beneficio "Acceso a clases" (no pueden inscribirse a clases).
    /// Traducible a SQL.
    /// </summary>
    public static IQueryable<Membresia> SinAccesoAClases(
        this IQueryable<Membresia> source,
        DateTime hoy)
    {
        var nombre = Normalizar(BeneficioAccesoAClases);

        return source
            .Where(m => m.Estado != EstadoMembresia.Cancelada &&
                        m.Estado != EstadoMembresia.Vencida &&
                        m.FechaInicio.Date <= hoy.Date &&
                        m.FechaFin.Date >= hoy.Date)
            .Where(m => m.Plan != null &&
                        !m.Plan.PlanesBeneficios.Any(pb =>
                            pb.Beneficio != null &&
                            pb.Beneficio.Nombre.Trim().ToLower() == nombre));
    }
}