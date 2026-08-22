using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Validaciones de planes: nombre, precio base, duración y el
/// escalón obligatorio de precios (cada período mayor al anterior).
/// </summary>
public static class PlanesValidaciones
{
    public static string? ValidarPlan(Plan plan)
    {
        if (string.IsNullOrWhiteSpace(plan.Nombre))
        {
            return "El nombre del plan es obligatorio.";
        }

        if (plan.Precio < 0)
        {
            return "El precio base no puede ser negativo.";
        }

        return ValidarEscalonPrecios(
            plan.Precio1Mes,
            plan.Precio3Meses,
            plan.Precio6Meses,
            plan.Precio12Meses);
    }

    /// <summary>
    /// Escalón de precios: 1 &lt; 3 &lt; 6 &lt; 12 meses.
    /// Reutilizado por alta, actualización y actualización de precios.
    /// </summary>
    public static string? ValidarEscalonPrecios(
        decimal precio1Mes,
        decimal precio3Meses,
        decimal precio6Meses,
        decimal precio12Meses)
    {
        if (precio1Mes <= 0)
        {
            return "El precio de 1 mes debe ser mayor a cero.";
        }

        if (precio3Meses <= precio1Mes)
        {
            return "El precio de 3 meses debe ser mayor al precio de 1 mes.";
        }

        if (precio6Meses <= precio3Meses)
        {
            return "El precio de 6 meses debe ser mayor al precio de 3 meses.";
        }

        if (precio12Meses <= precio6Meses)
        {
            return "El precio de 12 meses debe ser mayor al precio de 6 meses.";
        }

        return null;
    }
}
