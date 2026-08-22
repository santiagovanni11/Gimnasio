namespace GimnasioAPI.Models;

public class Beneficio
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public bool Activo { get; set; } = true;

    public ICollection<PlanBeneficio> PlanesBeneficios { get; set; }
        = new List<PlanBeneficio>();
}