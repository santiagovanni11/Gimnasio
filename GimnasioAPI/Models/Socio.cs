namespace GimnasioAPI.Models;

public class Socio
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Apellido { get; set; } = string.Empty;

    public string DNI { get; set; } = string.Empty;

    public DateTime FechaNacimiento { get; set; }

    public string Telefono { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Direccion { get; set; }

    public string? FotoUrl { get; set; }

    public string? ContactoEmergencia { get; set; }

    public string? TelefonoEmergencia { get; set; }

    public DateTime FechaAlta { get; set; } = DateTime.UtcNow;

    public bool Activo { get; set; } = true;
}