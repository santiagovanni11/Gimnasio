namespace GimnasioAPI.DTOs;

public class PlanDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    // Precio base.
    public decimal Precio { get; set; }

    // Precios según duración.
    public decimal Precio1Mes { get; set; }

    public decimal Precio3Meses { get; set; }

    public decimal Precio6Meses { get; set; }

    public decimal Precio12Meses { get; set; }

    public string Tipo { get; set; } = string.Empty;

    public bool Activo { get; set; }

    public List<BeneficioDto> Beneficios { get; set; } = new();

    public List<ClaseDto> Clases { get; set; } = new();
}

public class BeneficioDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public bool Activo { get; set; }
}