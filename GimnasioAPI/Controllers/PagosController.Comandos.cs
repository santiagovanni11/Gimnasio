using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de pagos: registro, edición y anulación lógica.
/// </summary>
public partial class PagosController
{
    // POST: api/Pagos
    [HttpPost]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<PagoDto>> PostPago(Pago pago)
    {
        var membresia = await _context.Membresias
            .Include(m => m.Socio)
            .Include(m => m.Plan)
            .FirstOrDefaultAsync(m => m.Id == pago.MembresiaId);

        if (membresia == null)
            return BadRequest("La membresía indicada no existe.");

        var errorMonto = PagosValidaciones.ValidarMonto(
            pago.Monto, membresia.PrecioAplicado);

        if (errorMonto != null)
            return BadRequest(errorMonto);

        pago.RegistradoPor = _auditoria.ObtenerEmailActor();

        _context.Pagos.Add(pago);
        await _context.SaveChangesAsync();

        await ActivarMembresiaSiAprobadaAsync(membresia, pago.Estado);

        return CreatedAtAction(
            nameof(GetPago),
            new { id = pago.Id },
            MapearDto(pago));
    }

    // PUT: api/Pagos/5
    [HttpPut("{id}")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> PutPago(int id, Pago pago)
    {
        if (id != pago.Id)
            return BadRequest();

        var membresia = await _context.Membresias
            .FirstOrDefaultAsync(m => m.Id == pago.MembresiaId);

        if (membresia == null)
            return BadRequest("La membresía indicada no existe.");

        var errorMonto = PagosValidaciones.ValidarMonto(
            pago.Monto, membresia.PrecioAplicado);

        if (errorMonto != null)
            return BadRequest(errorMonto);

        _context.Entry(pago).State = EntityState.Modified;

        var resultado = await _context.GuardarAsync(
            () => _context.Pagos.AnyAsync(e => e.Id == id));

        if (resultado != null)
            return resultado;

        await ActivarMembresiaSiAprobadaAsync(membresia, pago.Estado);

        return NoContent();
    }

    private async Task ActivarMembresiaSiAprobadaAsync(
        Membresia? membresia,
        EstadoPago estadoPago)
    {
        if (membresia == null || estadoPago != EstadoPago.Aprobado)
            return;

        ReglasMembresia.RecalcularEstado(
            membresia, DateTime.UtcNow, tienePagoAprobado: true);

        await _context.SaveChangesAsync();
    }

    // DELETE: api/Pagos/5?motivo=...
    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> DeletePago(
        int id,
        [FromQuery] string motivo)
    {
        if (string.IsNullOrWhiteSpace(motivo))
            return BadRequest("El motivo de anulación es obligatorio.");

        var pago = await _context.Pagos.FindAsync(id);

        if (pago == null)
            return NotFound();

        if (pago.Estado == EstadoPago.Anulado)
            return BadRequest("El pago ya se encuentra anulado.");

        pago.Estado = EstadoPago.Anulado;
        pago.MotivoAnulacion = motivo.Trim();
        pago.AnuladoPor = _auditoria.ObtenerEmailActor();
        pago.FechaAnulacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
