namespace GimnasioAPI.DTOs;

public class AsistenciaDto
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public string SocioNombre { get; set; } = string.Empty;

    public string SocioApellido { get; set; } = string.Empty;

    public int? InscripcionClaseId { get; set; }

    public int? HorarioClaseId { get; set; }

    public string? ClaseNombre { get; set; }

    public string? EmpleadoNombre { get; set; }

    public string? EmpleadoApellido { get; set; }

    public DayOfWeek? DiaSemana { get; set; }

    public TimeSpan? HoraInicio { get; set; }

    public TimeSpan? HoraFin { get; set; }

    public DateTime Fecha { get; set; }

    public bool Presente { get; set; }

    public string Motivo { get; set; } = "normal";

    public string? DetalleMotivo { get; set; }

    public string? RegistradoPor { get; set; }

    public int? RegistradoPorId { get; set; }

    public DateTime FechaModificacion { get; set; }
}