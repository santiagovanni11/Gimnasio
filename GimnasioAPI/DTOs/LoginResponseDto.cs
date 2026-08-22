namespace GimnasioAPI.DTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;

    public int UsuarioId { get; set; }

    public string Email { get; set; } = string.Empty;

    public int RolId { get; set; }

    public string RolNombre { get; set; } = string.Empty;

    public DateTime Expira { get; set; }
}