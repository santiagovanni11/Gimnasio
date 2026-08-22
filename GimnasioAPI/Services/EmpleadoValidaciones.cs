using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Validaciones de empleados compartidas por alta y
/// actualización (campos obligatorios básicos).
/// </summary>
public static class EmpleadoValidaciones
{
    public static string? ValidarDatos(Empleado empleado)
    {
        if (string.IsNullOrWhiteSpace(empleado.Nombre))
        {
            return "El nombre es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(empleado.Apellido))
        {
            return "El apellido es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(empleado.DNI))
        {
            return "El DNI es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(empleado.Email))
        {
            return "El email es obligatorio.";
        }

        return null;
    }
}
