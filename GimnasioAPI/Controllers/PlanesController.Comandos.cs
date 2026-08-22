using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de planes: alta, actualización, precios y baja.
/// </summary>
public partial class PlanesController
{
    // POST: api/Planes — Solo Administrador.
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<Plan>> PostPlan(Plan plan)
    {
        var error = PlanesValidaciones.ValidarPlan(plan);

        if (error != null)
        {
            return BadRequest(error);
        }

        plan.Activo = true;

        _context.Planes.Add(plan);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPlan),
            new { id = plan.Id },
            plan);
    }

    // PUT: api/Planes/5 — Solo Administrador.
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> PutPlan(int id, Plan plan)
    {
        if (id != plan.Id)
        {
            return BadRequest(
                "El ID de la URL no coincide con el ID del plan.");
        }

        var error = PlanesValidaciones.ValidarPlan(plan);

        if (error != null)
        {
            return BadRequest(error);
        }

        var existente = await _context.Planes
            .FirstOrDefaultAsync(p => p.Id == id);

        if (existente == null)
        {
            return NotFound("El plan no existe.");
        }

        existente.Nombre = plan.Nombre.Trim();
        existente.Descripcion =
            plan.Descripcion?.Trim() ?? string.Empty;
        existente.Precio = plan.Precio;

        existente.Precio1Mes = plan.Precio1Mes;
        existente.Precio3Meses = plan.Precio3Meses;
        existente.Precio6Meses = plan.Precio6Meses;
        existente.Precio12Meses = plan.Precio12Meses;

        existente.Tipo = plan.Tipo;
        existente.Activo = plan.Activo;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/Planes/5/precios — Solo Administrador.
    [HttpPut("{id}/precios")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> ActualizarPrecios(
        int id,
        ActualizarPreciosPlanDto precios)
    {
        var error = PlanesValidaciones.ValidarEscalonPrecios(
            precios.Precio1Mes,
            precios.Precio3Meses,
            precios.Precio6Meses,
            precios.Precio12Meses);

        if (error != null)
        {
            return BadRequest(error);
        }

        var plan = await _context.Planes
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plan == null)
        {
            return NotFound("El plan no existe.");
        }

        // Auditoría + vigencia: si VigenteDesde es futura el
        // cambio queda Pendiente; si no, se aplica al instante.
        await RegistrarCambioPreciosAsync(id, precios);

        return Ok(new
        {
            programado = precios.VigenteDesde.HasValue &&
                precios.VigenteDesde.Value.Date >
                DateTime.UtcNow.Date,
            vigenteDesde = precios.VigenteDesde
        });
    }
}
