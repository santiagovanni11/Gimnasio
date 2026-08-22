namespace GimnasioAPI.DTOs;

public class HorarioClaseDto
{
    public int Id { get; set; }

    public int ClaseId { get; set; }

    public string ClaseNombre { get; set; } = string.Empty;

    public int EmpleadoId { get; set; }

    public string EmpleadoNombre { get; set; } = string.Empty;

    public string EmpleadoApellido { get; set; } = string.Empty;

    public DayOfWeek DiaSemana { get; set; }

    public TimeSpan HoraInicio { get; set; }

    public TimeSpan HoraFin { get; set; }

    public bool Activo { get; set; }
}