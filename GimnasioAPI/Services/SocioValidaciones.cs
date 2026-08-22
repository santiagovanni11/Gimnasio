using System.Text.RegularExpressions;
using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Validaciones de datos personales de socios compartidas por
/// el alta y la actualización.
/// </summary>
public static class SocioValidaciones
{
    public static string? ValidarDatos(Socio socio)
    {
        if (string.IsNullOrWhiteSpace(socio.Nombre))
        {
            return "El nombre es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(socio.Apellido))
        {
            return "El apellido es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(socio.DNI))
        {
            return "El DNI es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(socio.Telefono))
        {
            return "El teléfono es obligatorio.";
        }

        if (string.IsNullOrWhiteSpace(socio.Email))
        {
            return "El email es obligatorio.";
        }

        if (socio.FechaNacimiento == default)
        {
            return "La fecha de nacimiento es obligatoria.";
        }

        // Nombre: letras, espacios y caracteres españoles.
        if (!Regex.IsMatch(
                socio.Nombre.Trim(),
                @"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"))
        {
            return
                "El nombre solo puede contener letras y espacios.";
        }

        // Apellido: letras, espacios y caracteres españoles.
        if (!Regex.IsMatch(
                socio.Apellido.Trim(),
                @"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"))
        {
            return
                "El apellido solo puede contener letras y espacios.";
        }

        // DNI: solamente números, entre 7 y 8 dígitos.
        if (!Regex.IsMatch(socio.DNI.Trim(), @"^\d{7,8}$"))
        {
            return "El DNI debe contener entre 7 y 8 números.";
        }

        // Teléfono: solamente números, entre 8 y 15 dígitos.
        if (!Regex.IsMatch(socio.Telefono.Trim(), @"^\d{8,15}$"))
        {
            return "El teléfono debe contener entre 8 y 15 números.";
        }

        // Email: validación básica de formato.
        if (!Regex.IsMatch(
                socio.Email.Trim(),
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            return "El email no tiene un formato válido.";
        }

        return null;
    }
}
