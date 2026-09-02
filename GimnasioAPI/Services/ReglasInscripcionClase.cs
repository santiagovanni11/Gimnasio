using System.Linq.Expressions;
using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Reglas de vigencia de inscripciones a clases. Una
/// inscripción ocupa cupo mientras no esté cancelada y su
/// FechaHasta (si fue definida) no haya pasado. Patrón de
/// recálculo perezoso: nada se borra, solo deja de contar.
/// </summary>
public static class ReglasInscripcionClase
{
    /// <summary>
    /// Predicado traducible a SQL: inscripciones que ocupan
    /// cupo al día de hoy.
    /// </summary>
    public static Expression<Func<InscripcionClase, bool>>
        OcupaCupo(DateTime hoy) =>
        i => i.Estado != EstadoInscripcion.Cancelada &&
            (i.FechaHasta == null ||
                i.FechaHasta.Value.Date >= hoy.Date);

    /// <summary>Versión en memoria del mismo criterio.</summary>
    public static bool OcupaCupoEn(
        InscripcionClase inscripcion,
        DateTime hoy)
    {
        return inscripcion.Estado != EstadoInscripcion.Cancelada &&
            (inscripcion.FechaHasta == null ||
                inscripcion.FechaHasta.Value.Date >= hoy.Date);
    }

    /// <summary>
    /// Predicado traducible a SQL: inscripciones ACTIVAS cuyo
    /// horario cae el MISMO día y con franja superpuesta a la
    /// propuesta. Tocarse en el borde no cuenta como choque.
    /// </summary>
    public static Expression<Func<InscripcionClase, bool>>
        SeSuperponeEn(
            DayOfWeek dia,
            TimeSpan horaInicio,
            TimeSpan horaFin,
            DateTime hoy) =>
        i => i.Estado != EstadoInscripcion.Cancelada &&
            (i.FechaHasta == null ||
                i.FechaHasta.Value.Date >= hoy.Date) &&
            i.HorarioClase!.DiaSemana == dia &&
            i.HorarioClase!.HoraInicio < horaFin &&
            horaInicio < i.HorarioClase!.HoraFin;
}
