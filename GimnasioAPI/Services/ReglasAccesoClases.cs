using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Reglas de acceso a clases según el plan de la membresía.
/// El acceso es POSITIVO: un socio puede inscribirse a clases
/// solo si su plan incluye acceso a clases, lo que se cumple si
/// el plan tiene clases vinculadas (PlanesClases) O el beneficio
/// canónico "Acceso a clases" asignado. Si el plan no cumple
/// ninguna de las dos, el socio no tiene acceso (el frontend lo
/// oculta y la API lo rechaza). Así la vinculación visual de
/// clases al plan habilita la inscripción sin depender de un
/// nombre de beneficio puntual.
/// </summary>
public static class ReglasAccesoClases
{
    /// <summary>Beneficio canónico que habilita el acceso a clases.</summary>
    public const string BeneficioAccesoAClases = "Acceso a clases";

    /// <summary>Normaliza un nombre de beneficio para comparar.</summary>
    internal static string Normalizar(string? nombre) =>
        (nombre ?? string.Empty).Trim().ToLowerInvariant();

    /// <summary>
    /// Indica si el plan NO incluye acceso a clases: no tiene clases
    /// vinculadas y tampoco el beneficio canónico "Acceso a clases".
    /// </summary>
    public static bool PlanSinAccesoAClases(Plan plan)
    {
        if (plan == null) return true;

        bool tieneClases = plan.PlanesClases != null &&
            plan.PlanesClases.Any();

        bool tieneBeneficio = plan.PlanesBeneficios != null &&
            plan.PlanesBeneficios.Any(pb =>
                pb.Beneficio != null &&
                Normalizar(pb.Beneficio.Nombre) ==
                    Normalizar(BeneficioAccesoAClases));

        return !tieneClases && !tieneBeneficio;
    }

    /// <summary>
    /// IDs de socios cuya membresía vigente tiene un plan SIN acceso
    /// a clases (no pueden inscribirse). Traducible a SQL.
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
                        !m.Plan.PlanesClases.Any() &&
                        !m.Plan.PlanesBeneficios.Any(pb =>
                            pb.Beneficio != null &&
                            pb.Beneficio.Nombre.Trim().ToLower() == nombre));
    }
}
