using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Edicion y baja de asistencias.
/// </summary>
public partial class AsistenciasController
{
    // PUT: api/Asistencias/5 — Administrador y Recepcionista.
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> PutAsistencia(
        int id,
        Asistencia asistencia)
    {
        if (id != asistencia.Id)
        {
            return BadRequest();
        }

        var existente = await _context.Asistencias
            .FirstOrDefaultAsync(a => a.Id == id);

        if (existente == null)
        {
            return NotFound();
        }

        var socioExiste = await _context.Socios
            .AnyAsync(s =>
                s.Id == asistencia.SocioId && s.Activo);

        if (!socioExiste)
        {
            return BadRequest(
                "El socio indicado no existe o está inactivo.");
        }

        if (asistencia.InscripcionClaseId.HasValue)
        {
            var inscripcion = await _context.InscripcionesClases
                .FirstOrDefaultAsync(i =>
                    i.Id == asistencia.InscripcionClaseId.Value);

            if (inscripcion == null)
            {
                return BadRequest(
                    "La inscripción indicada no existe.");
            }

            if (inscripcion.SocioId != asistencia.SocioId)
            {
                return BadRequest(
                    "La inscripción no pertenece al socio indicado.");
            }

            if (inscripcion.Estado == EstadoInscripcion.Cancelada)
            {
                return BadRequest(
                    "No se puede asociar una asistencia a una inscripción cancelada.");
            }
        }

        // Evitar duplicados al modificar.
        var duplicada = await ExisteDuplicadaAsync(
            asistencia.InscripcionClaseId,
            asistencia.Fecha.Date,
            excluirId: id);

        if (duplicada)
        {
            return BadRequest(
                "Ya existe otra asistencia para esta inscripción en esa fecha.");
        }

        existente.SocioId = asistencia.SocioId;
        existente.InscripcionClaseId =
            asistencia.InscripcionClaseId;
        existente.Fecha = asistencia.Fecha;
        existente.Presente = asistencia.Presente;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Asistencias/5 — Solo Administrador.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> DeleteAsistencia(int id)
    {
        var asistencia = await _context.Asistencias.FindAsync(id);

        if (asistencia == null)
        {
            return NotFound();
        }

        _context.Asistencias.Remove(asistencia);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Task<InscripcionClase?> CargarInscripcionCompleta(int id)
    {
        return _context.InscripcionesClases
            .Include(i => i.HorarioClase)
                .ThenInclude(h => h!.Clase)
            .Include(i => i.HorarioClase)
                .ThenInclude(h => h!.Empleado)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    private Task<bool> ExisteDuplicadaAsync(
        int? inscripcionClaseId,
        DateTime fechaDia,
        int? excluirId)
    {
        return _context.Asistencias
            .AnyAsync(a =>
                a.Id != excluirId &&
                a.InscripcionClaseId == inscripcionClaseId &&
                a.Fecha.Date == fechaDia);
    }
}
