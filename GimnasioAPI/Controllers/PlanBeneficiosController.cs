using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PlanBeneficiosController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlanBeneficiosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/PlanBeneficios
    // Todos los roles pueden consultar.
    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<IEnumerable<PlanBeneficio>>> GetPlanBeneficios()
    {
        return await _context.PlanesBeneficios
            .Include(pb => pb.Plan)
            .Include(pb => pb.Beneficio)
            .ToListAsync();
    }

    // GET: api/PlanBeneficios/1
    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<PlanBeneficio>> GetPlanBeneficio(int id)
    {
        var planBeneficio = await _context.PlanesBeneficios
            .Include(pb => pb.Plan)
            .Include(pb => pb.Beneficio)
            .FirstOrDefaultAsync(pb => pb.Id == id);

        if (planBeneficio == null)
        {
            return NotFound();
        }

        return planBeneficio;
    }

    // POST: api/PlanBeneficios
    // Administrador y Recepcionista pueden asociar un beneficio a un plan.
    [HttpPost]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<ActionResult<PlanBeneficio>> PostPlanBeneficio(
        PlanBeneficio planBeneficio)
    {
        var planExiste = await _context.Planes
            .AnyAsync(p =>
                p.Id == planBeneficio.PlanId &&
                p.Activo);

        if (!planExiste)
        {
            return BadRequest(
                "El plan indicado no existe o está inactivo.");
        }

        var beneficioExiste = await _context.Beneficios
            .AnyAsync(b =>
                b.Id == planBeneficio.BeneficioId &&
                b.Activo);

        if (!beneficioExiste)
        {
            return BadRequest(
                "El beneficio indicado no existe o está inactivo.");
        }

        var relacionExiste = await _context.PlanesBeneficios
            .AnyAsync(pb =>
                pb.PlanId == planBeneficio.PlanId &&
                pb.BeneficioId == planBeneficio.BeneficioId);

        if (relacionExiste)
        {
            return BadRequest(
                "El beneficio ya está asociado a este plan.");
        }

        _context.PlanesBeneficios.Add(planBeneficio);

        await _context.SaveChangesAsync();

        var resultado = await _context.PlanesBeneficios
            .Include(pb => pb.Plan)
            .Include(pb => pb.Beneficio)
            .FirstAsync(pb => pb.Id == planBeneficio.Id);

        return CreatedAtAction(
            nameof(GetPlanBeneficio),
            new { id = planBeneficio.Id },
            resultado);
    }

    // DELETE: api/PlanBeneficios/1
    // Administrador y Recepcionista pueden quitar la relación.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> DeletePlanBeneficio(int id)
    {
        var planBeneficio = await _context.PlanesBeneficios
            .FindAsync(id);

        if (planBeneficio == null)
        {
            return NotFound();
        }

        _context.PlanesBeneficios.Remove(planBeneficio);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

