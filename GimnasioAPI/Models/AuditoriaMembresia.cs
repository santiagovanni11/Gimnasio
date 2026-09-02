namespace GimnasioAPI.Models;

/// <summary>
/// Registro de auditoría de membresías. Guarda el ID del socio
/// como snapshot para que el historial sobreviva a bajas.
/// </summary>
public class AuditoriaMembresia
{
    public int Id { get; set; }

    /// <summary>Acción realizada (ej: Suspensión).</summary>
    public string Accion { get; set; } = string.Empty;

    public int MembresiaId { get; set; }

    public int SocioId { get; set; }

    /// <summary>Usuario que ejecutó la acción (null si el propio).</summary>
    public int? RealizadoPorId { get; set; }

    public string? RealizadoPorEmail { get; set; }

    public string? Detalle { get; set; }

    public DateTime FechaUtc { get; set; } = DateTime.UtcNow;
}
