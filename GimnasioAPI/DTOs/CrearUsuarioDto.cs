namespace GimnasioAPI.DTOs;

public class CrearUsuarioDto
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public int RolId { get; set; }
}