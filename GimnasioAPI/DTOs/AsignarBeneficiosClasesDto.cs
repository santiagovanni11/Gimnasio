namespace GimnasioAPI.DTOs;

/// <summary>
/// IDs de beneficios y clases a asociar a un plan. El endpoint
/// reemplaza las asociaciones previas por las indicadas.
/// </summary>
public class AsignarBeneficiosClasesDto
{
    public List<int> Beneficios { get; set; } = new();

    public List<int> Clases { get; set; } = new();
}
