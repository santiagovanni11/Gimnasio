using GimnasioAPI.Models;

namespace GimnasioAPI.Models;

/// <summary>
/// Auditoría y vigencia de cambios de precio por plan.
/// Estado "Aplicada": los valores ya rigen en el plan.
/// Estado "Pendiente": rigen desde VigenteDesde (aplicado
/// de forma perezosa al consultar planes).
/// </summary>
public class HistorialPrecioPlan
{
    public int Id { get; set; }

    public int PlanId { get; set; }

    public Plan? Plan { get; set; }

    /// <summary>Email del usuario que registró el cambio.</summary>
    public string Usuario { get; set; } = string.Empty;

    public DateTime FechaUtc { get; set; } = DateTime.UtcNow;

    /// <summary>"Aplicada" o "Pendiente".</summary>
    public string Estado { get; set; } = "Aplicada";

    /// <summary>Fecha desde la que rigen los valores.</summary>
    public DateTime? VigenteDesde { get; set; }

    public decimal Precio1Mes { get; set; }

    public decimal Precio3Meses { get; set; }

    public decimal Precio6Meses { get; set; }

    public decimal Precio12Meses { get; set; }
}
