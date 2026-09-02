using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
    // Filtros opcionales: ?desde=yyyy-mm-dd&hasta=...&socioId=&horarioClaseId=
    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<AsistenciaDto>>>
        GetAsistencias(
            [FromQuery] int? socioId = null,
            [FromQuery] int? horarioClaseId = null,
            [FromQuery] DateTime? desde = null,
            [FromQuery] DateTime? hasta = null)
    {
        var consulta = CargarConRelaciones();

        if (socioId.HasValue)
        {
            consulta = consulta.Where(a => a.SocioId == socioId.Value);
        }

        if (desde.HasValue)
        {
            consulta = consulta.Where(a => a.Fecha.Date >= desde.Value.Date);
        }

        if (hasta.HasValue)
        {
            consulta = consulta.Where(a => a.Fecha.Date <= hasta.Value.Date);
        }

        // Filtro por horario: la asistencia va por inscripción.
        if (horarioClaseId.HasValue)
        {
            consulta = consulta.Where(a =>
                a.InscripcionClase != null &&
                a.InscripcionClase.HorarioClaseId == horarioClaseId.Value);
        }

        var asistencias = await consulta
            .OrderByDescending(a => a.Fecha)
            .ToListAsync();

        return Ok(asistencias.Select(MapearDto));
    }

    // GET: api/Asistencias/5
    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
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
                .ThenInclude(h => h.Clase)
            .Include(a => a.InscripcionClase)
                .ThenInclude(i => i!.HorarioClase)
                .ThenInclude(h => h.Empleado);
    }

    /// <summary>Proyección estándar de una asistencia a su DTO.</summary>
    internal static AsistenciaDto MapearDto(Asistencia a)
    {
        var horario = a.InscripcionClase?.HorarioClase;

        return new AsistenciaDto
        {
            Id = a.Id,

            SocioId = a.SocioId,
            SocioNombre = a.Socio?.Nombre ?? string.Empty,
            SocioApellido = a.Socio?.Apellido ?? string.Empty,

            InscripcionClaseId = a.InscripcionClaseId,
            HorarioClaseId = horario?.Id,

            ClaseNombre = horario?.Clase?.Nombre,
            EmpleadoNombre = horario?.Empleado?.Nombre,
            EmpleadoApellido = horario?.Empleado?.Apellido,
            DiaSemana = horario?.DiaSemana,
            HoraInicio = horario?.HoraInicio,
            HoraFin = horario?.HoraFin,

            Fecha = a.Fecha,
            Presente = a.Presente,
            Motivo = a.Motivo,
            DetalleMotivo = a.DetalleMotivo,
            RegistradoPor = a.RegistradoPor,
            RegistradoPorId = a.RegistradoPorId,
            FechaModificacion = a.FechaModificacion
        };
    }

    /// <summary>Identidad del usuario autenticado: id y email snapshot.</summary>
    internal (int Id, string Email) UsuarioActual()
    {
        var idTexto = User.FindFirstValue(
            System.Security.Claims.ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(
            System.Security.Claims.ClaimTypes.Email) ?? "Sistema";

        return (int.TryParse(idTexto, out var id) ? id : 0, email);
    }

    /// <summary>
    /// Rellena la auditoría de una marca según el usuario actual.
    /// </summary>
    internal void AplicarAuditoria(Asistencia asistencia)
    {
        var (id, email) = UsuarioActual();
        asistencia.RegistradoPorId = id;
        asistencia.RegistradoPor = email;
        asistencia.FechaModificacion = DateTime.UtcNow;
    }
}
