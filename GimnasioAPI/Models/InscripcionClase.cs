namespace GimnasioAPI.Models;

public class InscripcionClase
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public int HorarioClaseId { get; set; }

    public DateTime FechaInscripcion { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Vigencia opcional: al pasar la fecha la inscripción
    /// deja de ocupar cupo (recálculo perezoso), sin borrarse.
    /// </summary>
    public DateTime? FechaHasta { get; set; }

    public EstadoInscripcion Estado { get; set; } = EstadoInscripcion.Reservada;

    public Socio? Socio { get; set; }

    public HorarioClase? HorarioClase { get; set; }
}