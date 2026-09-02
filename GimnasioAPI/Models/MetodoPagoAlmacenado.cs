namespace GimnasioAPI.Models;

public class MetodoPagoAlmacenado
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public string Marca { get; set; } = string.Empty;

    public string UltimosCuatro { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;

    public int MesVencimiento { get; set; }

    public int AnioVencimiento { get; set; }

    public bool Activo { get; set; } = true;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public Socio? Socio { get; set; }
}
