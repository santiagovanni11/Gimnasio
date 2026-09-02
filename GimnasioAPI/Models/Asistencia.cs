namespace GimnasioAPI.Models;

public class Asistencia
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public int? InscripcionClaseId { get; set; }

    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    public bool Presente { get; set; } = true;

    /// <summary>Tipo de inasistencia: normal, justificado o reserva.</summary>
    public string Motivo { get; set; } = "normal";

    public string? DetalleMotivo { get; set; }

    /// <summary>Snapshot del usuario que registró/corrigió la marca.</summary>
    public string? RegistradoPor { get; set; }

    public int? RegistradoPorId { get; set; }

    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;

    public Socio? Socio { get; set; }

    public InscripcionClase? InscripcionClase { get; set; }
}