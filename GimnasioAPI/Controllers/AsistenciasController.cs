using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de asistencias (GET). Las mutaciones viven en la
/// parte Comandos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class AsistenciasController : ControllerBase
{
    private readonly AppDbContext _context;

    public AsistenciasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Asistencias
    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<IEnumerable<AsistenciaDto>>> GetAsistencias()
    {
        var asistencias = await CargarConRelaciones().ToListAsync();
        return Ok(asistencias.Select(MapearDto));
    }

    // GET: api/Asistencias/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<AsistenciaDto>> GetAsistencia(int id)
    {
        var asistencia = await CargarConRelaciones()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (asistencia == null)
        {
            return NotFound();
        }

        return Ok(MapearDto(asistencia));
    }

    private IQueryable<Asistencia> CargarConRelaciones()
    {
        return _context.Asistencias
            .Include(a => a.Socio)
            .Include(a => a.InscripcionClase)
                .ThenInclude(i => i!.HorarioClase)
                .ThenInclude(h => h.Clase);
    }

    /// <summary>Proyección estándar de una asistencia a su DTO.</summary>
    internal static AsistenciaDto MapearDto(Asistencia a)
    {
        return new AsistenciaDto
        {
            Id = a.Id,

            SocioId = a.SocioId,
            SocioNombre = a.Socio?.Nombre ?? string.Empty,
            SocioApellido = a.Socio?.Apellido ?? string.Empty,

            InscripcionClaseId = a.InscripcionClaseId,

            ClaseNombre = a.InscripcionClase?
                .HorarioClase?
                .Clase?
                .Nombre,

            Fecha = a.Fecha,
            Presente = a.Presente
        };
    }
}
