using System.Security.Claims;
using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de pagos: registro, actualización y anulación
/// lógica con motivo obligatorio (auditoría).
/// </summary>
public partial class PagosController
{
    // POST: api/Pagos — Administrador y Recepcionista.
    [HttpPost]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<ActionResult<PagoDto>> PostPago(Pago pago)
    {
        var membresia = await _context.Membresias
            .Include(m => m.Socio)
            .Include(m => m.Plan)
            .FirstOrDefaultAsync(m => m.Id == pago.MembresiaId);

        if (membresia == null)
        {
            return BadRequest("La membresía indicada no existe.");
        }

        if (pago.Monto <= 0)
        {
            return BadRequest("El monto debe ser mayor a cero.");
        }

        if (pago.Monto > membresia.PrecioAplicado)
        {
            return BadRequest(
                "El monto del pago no puede ser mayor al precio de la membresía.");
        }

        // Auditoría: quién registró el pago
        pago.RegistradoPor =
            User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.Identity?.Name
            ?? "desconocido";

        _context.Pagos.Add(pago);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPago),
            new { id = pago.Id },
            MapearDto(pago));
    }

    // PUT: api/Pagos/5 — Administrador y Recepcionista.
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> PutPago(int id, Pago pago)
    {
        if (id != pago.Id)
        {
            return BadRequest();
        }

        var membresiaExiste = await _context.Membresias
            .AnyAsync(m => m.Id == pago.MembresiaId);

        if (!membresiaExiste)
        {
            return BadRequest("La membresía indicada no existe.");
        }

        if (pago.Monto <= 0)
        {
            return BadRequest("El monto debe ser mayor a cero.");
        }

        _context.Entry(pago).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var sigue = await _context.Pagos.AnyAsync(e => e.Id == id);

            if (!sigue)
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/Pagos/5?motivo=...
    // SOLO Administrador. Anulación lógica con motivo obligatorio:
    // el pago no se elimina, queda marcado como Anulado (auditoría).
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DeletePago(
        int id,
        [FromQuery] string motivo)
    {
        if (string.IsNullOrWhiteSpace(motivo))
        {
            return BadRequest(
                "El motivo de anulación es obligatorio.");
        }

        var pago = await _context.Pagos.FindAsync(id);

        if (pago == null)
        {
            return NotFound();
        }

        pago.Estado = EstadoPago.Anulado;
        pago.MotivoAnulacion = motivo.Trim();

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
