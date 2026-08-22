namespace GimnasioAPI.DTOs;

public class MembresiaDto
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public string SocioNombre { get; set; } = string.Empty;

    public string SocioApellido { get; set; } = string.Empty;

    public int PlanId { get; set; }

    public string PlanNombre { get; set; } = string.Empty;

    public decimal PrecioAplicado { get; set; }

    public DateTime FechaInicio { get; set; }

    public DateTime FechaFin { get; set; }

    public int Estado { get; set; }

    public DateTime? UltimaRenovacion { get; set; }

    public DateTime FechaCreacion { get; set; }
}