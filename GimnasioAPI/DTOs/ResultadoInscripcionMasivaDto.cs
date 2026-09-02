namespace GimnasioAPI.DTOs;

/// <summary>
/// Resumen de una inscripción masiva: cuántos se inscribieron
/// y qué socios no pudieron (con el motivo de cada uno).
/// </summary>
public class ResultadoInscripcionMasivaDto
{
    public int Inscriptos { get; set; }

    public List<string> Errores { get; set; } = new();
}