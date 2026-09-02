using GimnasioAPI.Models;

namespace GimnasioAPI.DTOs;

public class InscripcionClaseDto
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public string SocioNombre { get; set; } = string.Empty;

    public string SocioApellido { get; set; } = string.Empty;

    public int HorarioClaseId { get; set; }

    public string ClaseNombre { get; set; } = string.Empty;

    public string EmpleadoNombre { get; set; } = string.Empty;

    public string EmpleadoApellido { get; set; } = string.Empty;

    public DayOfWeek DiaSemana { get; set; }

    public TimeSpan HoraInicio { get; set; }

    public TimeSpan HoraFin { get; set; }

    public DateTime FechaInscripcion { get; set; }

    /// <summary>Vigencia opcional definida en el alta/edición.</summary>
    public DateTime? FechaHasta { get; set; }

    /// <summary>Cálculo perezoso: la vigencia ya pasó.</summary>
    public bool Vencida { get; set; }

    public EstadoInscripcion Estado { get; set; }
}