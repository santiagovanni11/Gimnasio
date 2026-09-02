using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Validaciones de pagos. Regla de negocio del monto: debe ser
/// positivo y no superar el precio aplicado de la membresía.
/// Devuelve null cuando es válido.
/// </summary>
public static class PagosValidaciones
{
    public static string? ValidarMonto(
        decimal monto,
        decimal precioAplicado)
    {
        if (monto <= 0)
        {
            return "El monto debe ser mayor a cero.";
        }

        if (monto > precioAplicado)
        {
            return "El monto del pago no puede ser mayor al precio de la membresía.";
        }

        return null;
    }
}
