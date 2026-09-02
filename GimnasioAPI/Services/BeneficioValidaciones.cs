namespace GimnasioAPI.Services;

/// <summary>
/// Validaciones de campos de Beneficio compartidas por el
/// alta y la actualización (mismo patrón que SocioValidaciones
/// y EmpleadoValidaciones).
/// </summary>
public static class BeneficioValidaciones
{
    /// <summary>
    /// Nombre y descripción son obligatorios. Devuelve el
    /// mensaje de error o null si los campos son válidos.
    /// </summary>
    public static string? ValidarCampos(
        string? nombre,
        string? descripcion)
    {
        if (string.IsNullOrWhiteSpace(nombre))
        {
            return "El nombre del beneficio es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(descripcion))
        {
            return "La descripción del beneficio es obligatoria.";
        }

        return null;
    }
}
