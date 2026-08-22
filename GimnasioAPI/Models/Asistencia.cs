namespace GimnasioAPI.Models;

public class Asistencia
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public int? InscripcionClaseId { get; set; }

    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    public bool Presente { get; set; } = true;

    public Socio? Socio { get; set; }

    public InscripcionClase? InscripcionClase { get; set; }
}