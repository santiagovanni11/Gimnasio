namespace GimnasioAPI.Models;

public class Usuario
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>Nombre visible de la cuenta (opcional).</summary>
    public string? Nombre { get; set; }

    /// <summary>Apellido visible de la cuenta (opcional).</summary>
    public string? Apellido { get; set; }

    public int RolId { get; set; }

    public bool Activo { get; set; } = true;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    // ---------------------------------------------------------
    // Seguridad de acceso
    // ---------------------------------------------------------

    public DateTime? UltimoAcceso { get; set; }

    /// <summary>Intentos fallidos consecutivos de login.</summary>
    public int IntentosFallidos { get; set; }

    /// <summary>
    /// Si es futuro, la cuenta está bloqueada hasta ese momento
    /// por acumulación de intentos fallidos.
    /// </summary>
    public DateTime? BloqueadoHasta { get; set; }

    public Rol? Rol { get; set; }
}
