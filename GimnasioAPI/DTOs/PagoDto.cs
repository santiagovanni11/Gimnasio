using GimnasioAPI.Models;

namespace GimnasioAPI.DTOs;

public class PagoDto
{
    public int Id { get; set; }

    public int MembresiaId { get; set; }

    public int PlanId { get; set; }

    public string PlanNombre { get; set; } = string.Empty;

    public int SocioId { get; set; }

    public string SocioNombre { get; set; } = string.Empty;

    public string SocioApellido { get; set; } = string.Empty;

    public decimal Monto { get; set; }

    public FormaPago FormaPago { get; set; }

    public EstadoPago Estado { get; set; }

    public DateTime FechaPago { get; set; }

    public string? Referencia { get; set; }

    public string? Observaciones { get; set; }

    public string? RegistradoPor { get; set; }

    public string? MotivoAnulacion { get; set; }
}