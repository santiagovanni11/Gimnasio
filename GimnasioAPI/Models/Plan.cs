namespace GimnasioAPI.Models;

public class Plan
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    // Precio mensual base de referencia del plan. Se usa como
    // comparación para el ahorro del escalón y como precio
    // predeterminado (fallback) en duraciones no estándar.
    public decimal Precio { get; set; }

    // Precios según la duración de la membresía.
    public decimal Precio1Mes { get; set; }

    public decimal Precio3Meses { get; set; }

    public decimal Precio6Meses { get; set; }

    public decimal Precio12Meses { get; set; }

    public string Tipo { get; set; } = "Basico";

    public bool Activo { get; set; } = true;

    public ICollection<PlanBeneficio> PlanesBeneficios { get; set; }
        = new List<PlanBeneficio>();

    public ICollection<PlanClase> PlanesClases { get; set; }
        = new List<PlanClase>();

    public ICollection<Membresia> Membresias { get; set; }
        = new List<Membresia>();
}