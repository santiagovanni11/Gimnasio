using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de inscripciones a clases (GET). Las mutaciones
/// viven en la parte Comandos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class InscripcionesClasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InscripcionesClasesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/InscripcionesClases
    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<InscripcionClaseDto>>> GetInscripciones()
    {
        var inscripciones = await CargarConRelaciones().ToListAsync();
        return Ok(inscripciones.Select(MapearDto));
    }

    // GET: api/InscripcionesClases/5
    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<InscripcionClaseDto>> GetInscripcion(int id)
    {
        var inscripcion = await CargarConRelaciones()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (inscripcion == null)
        {
            return NotFound();
        }

        return Ok(MapearDto(inscripcion));
    }

    private IQueryable<InscripcionClase> CargarConRelaciones()
    {
        return _context.InscripcionesClases
            .Include(i => i.Socio)
            .Include(i => i.HorarioClase)
                .ThenInclude(h => h!.Clase)
            .Include(i => i.HorarioClase)
                .ThenInclude(h => h!.Empleado);
    }

    /// <summary>Proyección estándar de una inscripción a su DTO.</summary>
    internal static InscripcionClaseDto MapearDto(InscripcionClase i)
    {
        var hoy = DateTime.UtcNow.Date;

        return new InscripcionClaseDto
        {
            Id = i.Id,

            SocioId = i.SocioId,
            SocioNombre = i.Socio?.Nombre ?? string.Empty,
            SocioApellido = i.Socio?.Apellido ?? string.Empty,

            HorarioClaseId = i.HorarioClaseId,
            ClaseNombre =
                i.HorarioClase?.Clase?.Nombre ?? string.Empty,

            EmpleadoNombre =
                i.HorarioClase?.Empleado?.Nombre ?? string.Empty,
            EmpleadoApellido =
                i.HorarioClase?.Empleado?.Apellido ?? string.Empty,

            DiaSemana = i.HorarioClase?.DiaSemana ?? DayOfWeek.Sunday,
            HoraInicio = i.HorarioClase?.HoraInicio ?? TimeSpan.Zero,
            HoraFin = i.HorarioClase?.HoraFin ?? TimeSpan.Zero,

            FechaInscripcion = i.FechaInscripcion,
            FechaHasta = i.FechaHasta,

            // Recálculo perezoso: la vigencia definida ya pasó.
            Vencida = i.FechaHasta.HasValue &&
                i.FechaHasta.Value.Date < hoy &&
                i.Estado != EstadoInscripcion.Cancelada,

            Estado = i.Estado
        };
    }
}
