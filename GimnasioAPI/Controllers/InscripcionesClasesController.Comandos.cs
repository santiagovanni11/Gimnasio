using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de inscripciones: alta con control de capacidad,
/// actualización y cancelación lógica.
/// </summary>
public partial class InscripcionesClasesController
{
    // POST: api/InscripcionesClases — Administrador y Recepcionista.
    [HttpPost]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<ActionResult<InscripcionClaseDto>> PostInscripcion(
        InscripcionClase inscripcion)
    {
        var socio = await _context.Socios
            .FirstOrDefaultAsync(s =>
                s.Id == inscripcion.SocioId && s.Activo);

        if (socio == null)
        {
            return BadRequest(
                "El socio no existe o está inactivo.");
        }

        var horario = await _context.HorariosClases
            .Include(h => h.Clase)
            .Include(h => h.Empleado)
            .FirstOrDefaultAsync(h =>
                h.Id == inscripcion.HorarioClaseId);

        if (horario == null)
        {
            return BadRequest("El horario indicado no existe.");
        }

        if (!horario.Activo)
        {
            return BadRequest(
                "El horario seleccionado está inactivo.");
        }

        if (horario.Clase == null || !horario.Clase.Activa)
        {
            return BadRequest("La clase seleccionada está inactiva.");
        }

        // Evitar inscripción duplicada.
        var inscripcionExiste = await _context.InscripcionesClases
            .AnyAsync(i =>
                i.SocioId == inscripcion.SocioId &&
                i.HorarioClaseId == inscripcion.HorarioClaseId &&
                i.Estado != EstadoInscripcion.Cancelada);

        if (inscripcionExiste)
        {
            return BadRequest(
                "El socio ya está inscripto en este horario.");
        }

        // Contar reservas activas y validar capacidad.
        var cantidadInscritos = await _context.InscripcionesClases
            .CountAsync(i =>
                i.HorarioClaseId == inscripcion.HorarioClaseId &&
                i.Estado != EstadoInscripcion.Cancelada);

        if (cantidadInscritos >= horario.Clase.CapacidadMaxima)
        {
            return BadRequest(
                "La clase alcanzó su capacidad máxima.");
        }

        inscripcion.FechaInscripcion = DateTime.UtcNow;
        inscripcion.Estado = EstadoInscripcion.Reservada;

        _context.InscripcionesClases.Add(inscripcion);
        await _context.SaveChangesAsync();

        var resultado = MapearDto(inscripcion);
        resultado.SocioNombre = socio.Nombre;
        resultado.SocioApellido = socio.Apellido;
        resultado.ClaseNombre = horario.Clase.Nombre;
        resultado.EmpleadoNombre =
            horario.Empleado?.Nombre ?? string.Empty;
        resultado.EmpleadoApellido =
            horario.Empleado?.Apellido ?? string.Empty;
        resultado.DiaSemana = horario.DiaSemana;
        resultado.HoraInicio = horario.HoraInicio;
        resultado.HoraFin = horario.HoraFin;

        return CreatedAtAction(
            nameof(GetInscripcion),
            new { id = inscripcion.Id },
            resultado);
    }

    // PUT: api/InscripcionesClases/5 — Administrador y Recepcionista.
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> PutInscripcion(
        int id,
        InscripcionClase inscripcion)
    {
        if (id != inscripcion.Id)
        {
            return BadRequest();
        }

        var existente = await _context.InscripcionesClases
            .FirstOrDefaultAsync(i => i.Id == id);

        if (existente == null)
        {
            return NotFound();
        }

        existente.SocioId = inscripcion.SocioId;
        existente.HorarioClaseId = inscripcion.HorarioClaseId;
        existente.Estado = inscripcion.Estado;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/InscripcionesClases/5
    // Cancelación lógica: la inscripción puede tener asistencias
    // asociadas, por lo que no se elimina físicamente.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> DeleteInscripcion(int id)
    {
        var inscripcion = await _context.InscripcionesClases
            .FirstOrDefaultAsync(i => i.Id == id);

        if (inscripcion == null)
        {
            return NotFound();
        }

        inscripcion.Estado = EstadoInscripcion.Cancelada;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
