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
    [Authorize(Roles = RolesGimnasio.Administrador)]
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
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> PutHorario(
        int id,
        HorarioClase horario)
    {
        if (id != horario.Id)
        {
            return BadRequest();
        }

        var error = await ValidarHorarioAsync(
            horario,
            excluirId: id);

        if (error != null)
        {
            return BadRequest(error);
        }

        _context.Entry(horario).State = EntityState.Modified;

        var resultado = await _context.GuardarAsync(() =>
            _context.HorariosClases.AnyAsync(e => e.Id == id));

        if (resultado != null)
        {
            return resultado;
        }

        return NoContent();
    }

    // DELETE: api/HorariosClases/5 — Solo Administrador.
    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
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
    /// clase y el profesor (sin solapamientos). Devuelve null
    /// si todo es válido. excluirId: horario en edición.
    /// </summary>
    private async Task<string?> ValidarHorarioAsync(
        HorarioClase horario,
        int? excluirId = null)
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

        // Un profesor no puede estar en dos franjas que se
        // superpongan el mismo día (aunque sean de otra clase).
        var profesorOcupado = await ProfesorOcupadoAsync(
            horario,
            excluirId);

        if (profesorOcupado)
        {
            return "El profesor ya está asignado a otra " +
                "clase en ese día y horario.";
        }

        return null;
    }

    /// <summary>
    /// ¿Existe otro horario del mismo profesor, el mismo día,
    /// cuya franja se superponga con la propuesta?
    /// Tocarse en el borde no cuenta como superposición.
    /// </summary>
    private Task<bool> ProfesorOcupadoAsync(
        HorarioClase horario,
        int? excluirId)
    {
        var consulta = _context.HorariosClases.AsQueryable();

        if (excluirId.HasValue)
        {
            consulta = consulta.Where(
                h => h.Id != excluirId.Value);
        }

        return consulta.AnyAsync(h =>
            h.EmpleadoId == horario.EmpleadoId &&
            h.DiaSemana == horario.DiaSemana &&
            h.HoraInicio < horario.HoraFin &&
            horario.HoraInicio < h.HoraFin);
    }
}
