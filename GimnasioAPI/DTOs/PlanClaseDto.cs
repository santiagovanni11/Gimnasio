namespace GimnasioAPI.DTOs;

public class PlanClaseDto
{
    public int Id { get; set; }

    public int PlanId { get; set; }

    public int ClaseId { get; set; }

    public string PlanNombre { get; set; } = string.Empty;

    public string ClaseNombre { get; set; } = string.Empty;
}