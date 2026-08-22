using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlanClasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlanClasesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/PlanClases
    // Todos los roles pueden consultar.
    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<IEnumerable<PlanClaseDto>>> GetPlanClases()
    {
        var relaciones = await _context.PlanesClases
            .Include(pc => pc.Plan)
            .Include(pc => pc.Clase)
            .ToListAsync();

        var resultado = relaciones.Select(pc => new PlanClaseDto
        {
            Id = pc.Id,
            PlanId = pc.PlanId,
            ClaseId = pc.ClaseId,
            PlanNombre = pc.Plan?.Nombre ?? string.Empty,
            ClaseNombre = pc.Clase?.Nombre ?? string.Empty
        });

        return Ok(resultado);
    }

    // GET: api/PlanClases/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<PlanClaseDto>> GetPlanClase(int id)
    {
        var relacion = await _context.PlanesClases
            .Include(pc => pc.Plan)
            .Include(pc => pc.Clase)
            .FirstOrDefaultAsync(pc => pc.Id == id);

        if (relacion == null)
        {
            return NotFound();
        }

        var resultado = new PlanClaseDto
        {
            Id = relacion.Id,
            PlanId = relacion.PlanId,
            ClaseId = relacion.ClaseId,
            PlanNombre = relacion.Plan?.Nombre ?? string.Empty,
            ClaseNombre = relacion.Clase?.Nombre ?? string.Empty
        };

        return Ok(resultado);
    }

    // POST: api/PlanClases
    // Solo Administrador.
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<PlanClaseDto>> PostPlanClase(
        PlanClase planClase)
    {
        var planExiste = await _context.Planes
            .AnyAsync(p =>
                p.Id == planClase.PlanId &&
                p.Activo);

        if (!planExiste)
        {
            return BadRequest(
                "El plan no existe o está inactivo.");
        }

        var claseExiste = await _context.Clases
            .AnyAsync(c =>
                c.Id == planClase.ClaseId &&
                c.Activa);

        if (!claseExiste)
        {
            return BadRequest(
                "La clase no existe o está inactiva.");
        }

        var relacionExiste = await _context.PlanesClases
            .AnyAsync(pc =>
                pc.PlanId == planClase.PlanId &&
                pc.ClaseId == planClase.ClaseId);

        if (relacionExiste)
        {
            return BadRequest(
                "La clase ya está incluida en este plan.");
        }

        _context.PlanesClases.Add(planClase);

        await _context.SaveChangesAsync();

        var relacion = await _context.PlanesClases
            .Include(pc => pc.Plan)
            .Include(pc => pc.Clase)
            .FirstAsync(pc => pc.Id == planClase.Id);

        var resultado = new PlanClaseDto
        {
            Id = relacion.Id,
            PlanId = relacion.PlanId,
            ClaseId = relacion.ClaseId,
            PlanNombre = relacion.Plan?.Nombre ?? string.Empty,
            ClaseNombre = relacion.Clase?.Nombre ?? string.Empty
        };

        return CreatedAtAction(
            nameof(GetPlanClase),
            new { id = planClase.Id },
            resultado);
    }

    // DELETE: api/PlanClases/5
    // Solo Administrador.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DeletePlanClase(int id)
    {
        var planClase = await _context.PlanesClases
            .FindAsync(id);

        if (planClase == null)
        {
            return NotFound();
        }

        _context.PlanesClases.Remove(planClase);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}


