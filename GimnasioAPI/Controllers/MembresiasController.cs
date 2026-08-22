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

    public MembresiasController(
        AppDbContext context,
        ReglasMembresia reglas)
    {
        _context = context;
        _reglas = reglas;
    }

    // =========================================================
    // GET: api/Membresias
    // Administrador, Recepcionista y Profesor.
    // =========================================================

    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<IEnumerable<MembresiaDto>>> GetMembresias()
    {
        var membresias = await _context.Membresias
            .Include(m => m.Socio)
            .Include(m => m.Plan)
            .ToListAsync();

        var hoy = DateTime.UtcNow.Date;

        foreach (var membresia in membresias)
        {
            ReglasMembresia.RecalcularEstado(membresia, hoy);
        }

        await _context.SaveChangesAsync();

        return Ok(membresias.Select(MapearDto));
    }

    // =========================================================
    // GET: api/Membresias/5
    // Administrador, Recepcionista y Profesor.
    // =========================================================

    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
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

        ReglasMembresia.RecalcularEstado(
            membresia,
            DateTime.UtcNow.Date);

        await _context.SaveChangesAsync();

        return Ok(MapearDto(membresia));
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

            FechaCreacion = m.FechaCreacion
        };
    }
}
