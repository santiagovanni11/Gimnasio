namespace GimnasioAPI.DTOs;

public class AsistenciaDto
{
    public int Id { get; set; }

    public int SocioId { get; set; }

    public string SocioNombre { get; set; } = string.Empty;

    public string SocioApellido { get; set; } = string.Empty;

    public int? InscripcionClaseId { get; set; }

    public string? ClaseNombre { get; set; }

    public DateTime Fecha { get; set; }

    public bool Presente { get; set; }
}