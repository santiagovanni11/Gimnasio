namespace GimnasioAPI.Models;

/// <summary>
/// Registro de auditoría de cuentas de usuario. Guarda emails
/// como snapshot (sin FK) para que el historial sobreviva al
/// borrado físico de usuarios.
/// </summary>
public class AuditoriaUsuario
{
    public int Id { get; set; }

    /// <summary>Acción realizada (ej: Cambio de rol).</summary>
    public string Accion { get; set; } = string.Empty;

    /// <summary>Usuario afectado por la acción.</summary>
    public int UsuarioId { get; set; }

    public string EmailUsuario { get; set; } = string.Empty;

    /// <summary>Usuario que ejecutó la acción (null si el propio).</summary>
    public int? RealizadoPorId { get; set; }

    public string? RealizadoPorEmail { get; set; }

    public string? Detalle { get; set; }

    public DateTime FechaUtc { get; set; } = DateTime.UtcNow;
}
