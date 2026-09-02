using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de horarios de clases (GET). Las mutaciones viven
/// en la parte Comandos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class HorariosClasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public HorariosClasesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/HorariosClases
    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<HorarioClaseDto>>> GetHorarios()
    {
        var horarios = await CargarConRelaciones().ToListAsync();
        return Ok(horarios.Select(MapearDto));
    }

    // GET: api/HorariosClases/5
    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<HorarioClaseDto>> GetHorario(int id)
    {
        var horario = await CargarConRelaciones()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (horario == null)
        {
            return NotFound();
        }

        return Ok(MapearDto(horario));
    }

    private IQueryable<HorarioClase> CargarConRelaciones()
    {
        return _context.HorariosClases
            .Include(h => h.Clase)
            .Include(h => h.Empleado);
    }

    /// <summary>Proyección estándar de un horario a su DTO.</summary>
    internal static HorarioClaseDto MapearDto(HorarioClase h)
    {
        return new HorarioClaseDto
        {
            Id = h.Id,
            ClaseId = h.ClaseId,
            ClaseNombre = h.Clase?.Nombre ?? string.Empty,
            EmpleadoId = h.EmpleadoId,
            EmpleadoNombre = h.Empleado?.Nombre ?? string.Empty,
            EmpleadoApellido = h.Empleado?.Apellido ?? string.Empty,
            DiaSemana = h.DiaSemana,
            HoraInicio = h.HoraInicio,
            HoraFin = h.HoraFin,
            Activo = h.Activo
        };
    }
}
