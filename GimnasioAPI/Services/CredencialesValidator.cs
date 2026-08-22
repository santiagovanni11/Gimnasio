namespace GimnasioAPI.Services;

/// <summary>
/// Validaciones de credenciales compartidas por la creación
/// y actualización de usuarios (evita lógica duplicada).
/// </summary>
public static class CredencialesValidator
{
    public const int LargoMinimoPassword = 6;

    public static string ValidarEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return "El email es obligatorio.";
        }

        return "";
    }

    public static string ValidarPassword(string? password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            return "La contraseña es obligatoria.";
        }

        if (password.Length < LargoMinimoPassword)
        {
            return "La contraseña debe tener al menos 6 caracteres.";
        }

        return "";
    }
}
