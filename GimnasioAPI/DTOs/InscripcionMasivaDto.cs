namespace GimnasioAPI.DTOs;

/// <summary>
/// Alta masiva de inscripciones a un mismo horario.
/// </summary>
public class InscripcionMasivaDto
{
    public int HorarioClaseId { get; set; }

    public List<int> SociosIds { get; set; } = new();

    /// <summary>Vigencia opcional aplicada a todas las inscripciones.</summary>
    public DateTime? FechaHasta { get; set; }
}