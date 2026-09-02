using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de membresías (endpoints GET). Las mutaciones
/// viven en la parte Comandos; las reglas, en ReglasMembresia.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class MembresiasController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ReglasMembresia _reglas;
    private readonly AuditoriaMembresiasService _auditoria;

    public MembresiasController(
        AppDbContext context,
        ReglasMembresia reglas,
        AuditoriaMembresiasService auditoria)
    {
        _context = context;
        _reglas = reglas;
        _auditoria = auditoria;
    }

    // =========================================================
    // GET: api/Membresias
    // Administrador, Recepcionista y Profesor.
    // =========================================================

    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<MembresiaDto>>> GetMembresias()
    {
        var membresias = await _context.Membresias
            .Include(m => m.Socio)
            .Include(m => m.Plan)
            .ToListAsync();

        await RecalcularYGuardarAsync(membresias);

        return Ok(membresias.Select(MapearDto));
    }

    // =========================================================
    // GET: api/Membresias/5
    // Administrador, Recepcionista y Profesor.
    // =========================================================

    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<MembresiaDto>> GetMembresia(int id)
    {
        var membresia = await _context.Membresias
            .Include(x => x.Socio)
            .Include(x => x.Plan)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (membresia == null)
        {
            return NotFound();
        }

        await RecalcularYGuardarAsync(new[] { membresia });

        return Ok(MapearDto(membresia));
    }

    /// <summary>
    /// Aplica el recálculo automático de estado por fecha y
    /// pago efectuado, y persiste los cambios (patrón "aplicación
    /// perezosa").
    /// </summary>
    private async Task RecalcularYGuardarAsync(
        IEnumerable<Membresia> membresias)
    {
        var hoy = DateTime.UtcNow.Date;

        var ids = membresias.Select(m => m.Id).ToList();

        var aprobadas = new HashSet<int>(
            await _context.Pagos
                .Where(p => ids.Contains(p.MembresiaId) &&
                            p.Estado == EstadoPago.Aprobado)
                .Select(p => p.MembresiaId)
                .Distinct()
                .ToListAsync());

        foreach (var membresia in membresias)
        {
            ReglasMembresia.RecalcularEstado(
                membresia,
                hoy,
                aprobadas.Contains(membresia.Id));
        }

        await _context.SaveChangesAsync();
    }

    /// <summary>Proyección estándar de una membresía a su DTO.</summary>
    internal static MembresiaDto MapearDto(Membresia m)
    {
        return new MembresiaDto
        {
            Id = m.Id,

            SocioId = m.SocioId,
            SocioNombre = m.Socio?.Nombre ?? string.Empty,
            SocioApellido = m.Socio?.Apellido ?? string.Empty,

            PlanId = m.PlanId,
            PlanNombre = m.Plan?.Nombre ?? string.Empty,

            PrecioAplicado = m.PrecioAplicado,

            FechaInicio = m.FechaInicio,
            FechaFin = m.FechaFin,

            Estado = (int)m.Estado,

            UltimaRenovacion = m.UltimaRenovacion,

            RenovacionAutomatica = m.RenovacionAutomatica,
            MetodoPagoAlmacenadoId = m.MetodoPagoAlmacenadoId,

            FechaCreacion = m.FechaCreacion
        };
    }
}
