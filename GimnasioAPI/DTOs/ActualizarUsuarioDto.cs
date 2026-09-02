namespace GimnasioAPI.DTOs;

public class ActualizarUsuarioDto
{
    public string Email { get; set; } = string.Empty;

    /// <summary>Opcional: si viene vacía no se cambia.</summary>
    public string? Password { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public int RolId { get; set; }

    public bool Activo { get; set; } = true;
}