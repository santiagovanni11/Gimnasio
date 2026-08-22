namespace GimnasioAPI.DTOs;

public class ClaseDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public int DuracionMinutos { get; set; }

    public int CapacidadMaxima { get; set; }

    public bool Activa { get; set; }
}