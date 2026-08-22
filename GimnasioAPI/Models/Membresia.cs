namespace GimnasioAPI.Models;

public class Membresia
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public int PlanId { get; set; }

    public DateTime FechaInicio { get; set; }

    public DateTime FechaFin { get; set; }

    public decimal PrecioAplicado { get; set; }

    public EstadoMembresia Estado { get; set; } = EstadoMembresia.Pendiente;

    /// <summary>
    /// Momento en que se suspendió. Permite extender la fecha
    /// de fin por los días congelados al reactivar.
    /// </summary>
    public DateTime? FechaSuspension { get; set; }

    /// <summary>
    /// Sello del período de cobro vigente: se actualiza al
    /// renovar para que los pagos anteriores al mismo no
    /// cuenten en rechazos ni saldos del período actual.
    /// </summary>
    public DateTime? UltimaRenovacion { get; set; }

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public Socio? Socio { get; set; }

    public Plan? Plan { get; set; }

    public ICollection<Pago> Pagos { get; set; } = new List<Pago>();
}