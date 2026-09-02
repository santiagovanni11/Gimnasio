using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Beneficios y clases incluidos por plan: catálogo de
/// referencia y reasignación (reemplaza las asociaciones).
/// </summary>
public partial class PlanesController
{
    // =========================================================
    // GET: api/Planes/referencias — Solo Administrador.
    // Catálogo de beneficios y clases activos para asociar.
    // =========================================================

    [HttpGet("referencias")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> GetReferencias()
    {
        var beneficios = await _context.Beneficios
            .Where(b => b.Activo)
            .Select(b => new { b.Id, b.Nombre })
            .OrderBy(b => b.Nombre)
            .ToListAsync();

        var clases = await _context.Clases
            .Where(c => c.Activa)
            .Select(c => new { c.Id, c.Nombre })
            .OrderBy(c => c.Nombre)
            .ToListAsync();

        return Ok(new { beneficios, clases });
    }

    // =========================================================
    // PUT: api/Planes/5/beneficios-clases — Solo Administrador.
    // Reemplaza las asociaciones del plan por las indicadas.
    // =========================================================

    [HttpPut("{id}/beneficios-clases")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> AsignarBeneficiosClases(
        int id,
        AsignarBeneficiosClasesDto dto)
    {
        var plan = await _context.Planes
            .Include(p => p.PlanesBeneficios)
            .Include(p => p.PlanesClases)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plan == null)
        {
            return NotFound("El plan no existe.");
        }

        var beneficiosIds = dto.Beneficios.Distinct().ToList();
        var clasesIds = dto.Clases.Distinct().ToList();

        plan.PlanesBeneficios.Clear();
        foreach (var bId in beneficiosIds)
        {
            plan.PlanesBeneficios.Add(
                new PlanBeneficio { BeneficioId = bId });
        }

        plan.PlanesClases.Clear();
        foreach (var cId in clasesIds)
        {
            plan.PlanesClases.Add(new PlanClase { ClaseId = cId });
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
