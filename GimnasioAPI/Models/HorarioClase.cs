namespace GimnasioAPI.Models;

public class HorarioClase
{
    public int Id { get; set; }

    public int ClaseId { get; set; }

    public int EmpleadoId { get; set; }

    public DayOfWeek DiaSemana { get; set; }

    public TimeSpan HoraInicio { get; set; }

    public TimeSpan HoraFin { get; set; }

    public bool Activo { get; set; } = true;

    public Clase? Clase { get; set; }

    public Empleado? Empleado { get; set; }

    public ICollection<InscripcionClase> Inscripciones { get; set; } = new List<InscripcionClase>();
}