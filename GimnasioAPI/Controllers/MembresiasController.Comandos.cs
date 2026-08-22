using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de membresías: alta y actualización. Las
/// validaciones compartidas viven en ReglasMembresia; la
/// cancelación y baja física, en la parte Bajas; los cambios
/// de estado manuales, en la parte Estados.
/// </summary>
public partial class MembresiasController
{
    // =========================================================
    // POST: api/Membresias
    // Administrador y Recepcionista.
    // =========================================================

    [HttpPost]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<ActionResult<MembresiaDto>> PostMembresia(
        Membresia membresia)
    {
        var (plan, error) =
            await _reglas.ValidarParaAltaOEdicionAsync(membresia);

        if (!string.IsNullOrEmpty(error)) return BadRequest(error);

        ReglasMembresia.RecalcularEstado(
            membresia,
            DateTime.UtcNow.Date);

        membresia.PrecioAplicado =
            ReglasMembresia.CalcularPrecioSegunDuracion(
                plan,
                membresia.FechaInicio,
                membresia.FechaFin);

        membresia.FechaCreacion = DateTime.UtcNow;
        membresia.UltimaRenovacion = DateTime.UtcNow;

        _context.Membresias.Add(membresia);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMembresia),
            new { id = membresia.Id },
            MapearDto(membresia));
    }

    // =========================================================
    // PUT: api/Membresias/5[?renovacion=true]
    //
    // Con renovacion=true se actualiza el sello de período
    // (UltimaRenovacion) para que los cálculos de rechazo y
    // saldo miren solo el ciclo que comienza ahora.
    // =========================================================

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> PutMembresia(
        int id,
        Membresia membresia,
        [FromQuery] bool renovacion = false)
    {
        if (id != membresia.Id)
        {
            return BadRequest(
                "El ID de la URL no coincide con el ID de la membresía.");
        }

        var existente = await _context.Membresias
            .FirstOrDefaultAsync(m => m.Id == id);

        if (existente == null)
        {
            return NotFound("La membresía no existe.");
        }

        var (plan, error) =
            await _reglas.ValidarParaAltaOEdicionAsync(
                membresia,
                excluirId: id);

        if (!string.IsNullOrEmpty(error)) return BadRequest(error);

        existente.SocioId = membresia.SocioId;
        existente.PlanId = membresia.PlanId;
        existente.FechaInicio = membresia.FechaInicio;
        existente.FechaFin = membresia.FechaFin;

        if (renovacion)
        {
            existente.UltimaRenovacion = DateTime.UtcNow;
        }

        ReglasMembresia.RecalcularEstado(
            existente,
            DateTime.UtcNow.Date);

        existente.PrecioAplicado =
            membresia.PrecioAplicado > 0
                ? membresia.PrecioAplicado
                : ReglasMembresia.CalcularPrecioSegunDuracion(
                    plan,
                    existente.FechaInicio,
                    existente.FechaFin);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
