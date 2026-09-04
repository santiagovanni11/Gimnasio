using System.ComponentModel.DataAnnotations;

namespace GimnasioAPI.DTOs;

/// <summary>Paso 1: solicitud del código al email.</summary>
public class RecuperarPasswordDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// Paso 2: restablecimiento con el código recibido por email.
/// </summary>
public class RestablecerPasswordDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{6}$",
        ErrorMessage = "El código tiene 6 dígitos.")]
    public string Codigo { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string PasswordNueva { get; set; } = string.Empty;
}
