namespace GimnasioAPI.Models;

public class Pago
{
    public int Id { get; set; }

    public int MembresiaId { get; set; }

    public decimal Monto { get; set; }

    public FormaPago FormaPago { get; set; }

    public EstadoPago Estado { get; set; } = EstadoPago.Aprobado;

    public DateTime FechaPago { get; set; } = DateTime.UtcNow;

    public string? Referencia { get; set; }

    public string? Observaciones { get; set; }

    // Auditoría
    public string? RegistradoPor { get; set; }

    public string? MotivoAnulacion { get; set; }

    public Membresia? Membresia { get; set; }

}