using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de horarios de clases: alta, actualización y baja.
/// </summary>
public partial class HorariosClasesController
{
    // POST: api/HorariosClases — Solo Administrador.
    [HttpPost]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<HorarioClase>> PostHorario(
        HorarioClase horario)
    {
        var error = await ValidarHorarioAsync(horario);

        if (error != null)
        {
            return BadRequest(error);
        }

        horario.Activo = true;

        _context.HorariosClases.Add(horario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetHorario),
            new { id = horario.Id },
            horario);
    }

    // PUT: api/HorariosClases/5 — Solo Administrador.
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> PutHorario(
        int id,
        HorarioClase horario)
    {
        if (id != horario.Id)
        {
            return BadRequest();
        }

        var error = await ValidarHorarioAsync(horario);

        if (error != null)
        {
            return BadRequest(error);
        }

        _context.Entry(horario).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var sigue = await _context.HorariosClases
                .AnyAsync(e => e.Id == id);

            if (!sigue)
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/HorariosClases/5 — Solo Administrador.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DeleteHorario(int id)
    {
        var horario = await _context.HorariosClases.FindAsync(id);

        if (horario == null)
        {
            return NotFound();
        }

        _context.HorariosClases.Remove(horario);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Valida coherencia horaria y existencia activa de la
    /// clase y el empleado. Devuelve null si todo es válido.
    /// </summary>
    private async Task<string?> ValidarHorarioAsync(
        HorarioClase horario)
    {
        if (horario.HoraFin <= horario.HoraInicio)
        {
            return "La hora de finalización debe ser posterior a la hora de inicio.";
        }

        var claseExiste = await _context.Clases
            .AnyAsync(c => c.Id == horario.ClaseId && c.Activa);

        if (!claseExiste)
        {
            return "La clase no existe o está inactiva.";
        }

        var empleadoExiste = await _context.Empleados
            .AnyAsync(e =>
                e.Id == horario.EmpleadoId &&
                e.Activo);

        if (!empleadoExiste)
        {
            return "El empleado no existe o está inactivo.";
        }

        return null;
    }
}
