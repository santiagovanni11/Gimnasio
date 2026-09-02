namespace GimnasioAPI.Models;

/// <summary>
/// Registro de auditoría del ciclo de vida de un plan: alta,
/// edición, pausa/reactivación de venta y eliminación.
/// Guarda el nombre como snapshot para sobrevivir a bajas.
/// </summary>
public class AuditoriaPlan
{
    public int Id { get; set; }

    /// <summary>Acción realizada (ej: Pausa de venta).</summary>
    public string Accion { get; set; } = string.Empty;

    public int PlanId { get; set; }

    public string PlanNombre { get; set; } = string.Empty;

    /// <summary>Usuario que ejecutó la acción (null si el propio).</summary>
    public int? RealizadoPorId { get; set; }

    public string? RealizadoPorEmail { get; set; }

    public string? Detalle { get; set; }

    public DateTime FechaUtc { get; set; } = DateTime.UtcNow;
}
