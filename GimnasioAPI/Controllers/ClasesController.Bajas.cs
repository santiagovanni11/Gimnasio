using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Bajas y estados de clases. La baja física acepta cascada
/// explícita de horarios, pero nunca se toca si hay socios
/// inscriptos: esa historia se protege siempre (usar baja
/// lógica en ese caso).
/// </summary>
public partial class ClasesController
{
    // PUT: api/Clases/5/estado — Solo Administrador.
    [HttpPut("{id}/estado")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> CambiarEstado(
        int id,
        [FromBody] bool activa)
    {
        var clase = await _context.Clases.FindAsync(id);

        if (clase == null)
        {
            return NotFound();
        }

        clase.Activa = activa;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Clases/5[?enCascada=true] — Solo Administrador.
    //
    // Sin vínculos: borra directo.
    // Con horarios/relaciones de planes y ?enCascada=true:
    // borra clase + horarios + vínculos de planes.
    // Inscripciones activas bloquean SIEMPRE (historia).
    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> EliminarClase(
        int id,
        [FromQuery] bool enCascada = false)
    {
        var clase = await _context.Clases.FindAsync(id);

        if (clase == null)
        {
            return NotFound();
        }

        var horarios = await _context.HorariosClases
            .Where(h => h.ClaseId == id)
            .ToListAsync();

        var vinculosPlan = await _context.PlanesClases
            .Where(p => p.ClaseId == id)
            .ToListAsync();

        // Sin consentimiento de cascada, cualquier vínculo bloquea.
        if ((horarios.Count > 0 || vinculosPlan.Count > 0) &&
            !enCascada)
        {
            return BadRequest(
                "La clase tiene vínculos (horarios y/o planes). " +
                "Repetí la eliminación confirmando la cascada, " +
                "o desactivá la clase para conservar su historia.");
        }

        // Solo inscripciones VIGENTES bloquean; las vencidas
        // ya liberaron su cupo y no representan historia activa.
        if (await _context.InscripcionesClases
            .Where(ReglasInscripcionClase.OcupaCupo(
                DateTime.UtcNow.Date))
            .AnyAsync(i => i.HorarioClase!.ClaseId == id))
        {
            return BadRequest(
                "Hay socios inscriptos en esta clase. Para " +
                "conservar su historia usá la baja lógica " +
                "(Desactivar) o cancelá esas inscripciones.");
        }

        _context.PlanesClases.RemoveRange(vinculosPlan);
        _context.HorariosClases.RemoveRange(horarios);
        _context.Clases.Remove(clase);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
