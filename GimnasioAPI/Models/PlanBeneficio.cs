namespace GimnasioAPI.Models;

public class PlanBeneficio
{
    public int Id { get; set; }

    public int PlanId { get; set; }

    public int BeneficioId { get; set; }

    public Plan? Plan { get; set; }

    public Beneficio? Beneficio { get; set; }
}