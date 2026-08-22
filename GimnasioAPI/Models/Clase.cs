namespace GimnasioAPI.Models;

public class Clase
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public int DuracionMinutos { get; set; }

    public int CapacidadMaxima { get; set; }

    public bool Activa { get; set; } = true;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public ICollection<PlanClase> PlanesClases { get; set; } = new List<PlanClase>();

    public ICollection<HorarioClase> Horarios { get; set; } = new List<HorarioClase>();

    public ICollection<InscripcionClase> Inscripciones { get; set; } = new List<InscripcionClase>();
}