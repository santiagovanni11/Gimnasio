namespace GimnasioAPI.Models;

public class PlanClase
{
    public int Id { get; set; }

    public int PlanId { get; set; }

    public int ClaseId { get; set; }

    public Plan? Plan { get; set; }

    public Clase? Clase { get; set; }
}