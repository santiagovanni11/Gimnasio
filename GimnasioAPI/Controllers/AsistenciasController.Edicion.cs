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
    [Authorize(Roles = RolesGimnasio.Administracion)]
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
                "El socio no existe o está inactivo.");
        }

        if (asistencia.InscripcionClaseId.HasValue)
        {
            var inscripcion = await _context.InscripcionesClases
                .FirstOrDefaultAsync(i =>
                    i.Id == asistencia.InscripcionClaseId.Value);

            var error = ValidarInscripcionDeAsistencia(
                inscripcion,
                asistencia.SocioId);

            if (error != null)
            {
                return BadRequest(error);
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
        existente.Motivo = string.IsNullOrWhiteSpace(
            asistencia.Motivo) ? "normal" : asistencia.Motivo;
        existente.DetalleMotivo = asistencia.DetalleMotivo;

        AplicarAuditoria(existente);

        var inscripcionActual = existente.InscripcionClaseId.HasValue
            ? await _context.InscripcionesClases
                .FirstOrDefaultAsync(i =>
                    i.Id == existente.InscripcionClaseId.Value)
            : null;

        if (inscripcionActual != null)
        {
            inscripcionActual.Estado = existente.Presente
                ? EstadoInscripcion.Asistio
                : EstadoInscripcion.NoAsistio;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Asistencias/5 — Solo Administrador.
    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
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

    /// <summary>
    /// Reglas comunes de una inscripción asociada a una
    /// asistencia: debe existir, pertenecer al socio y no estar
    /// cancelada. Devuelve el mensaje de error o null.
    /// </summary>
    private static string? ValidarInscripcionDeAsistencia(
        InscripcionClase? inscripcion,
        int socioId)
    {
        if (inscripcion == null)
        {
            return "La inscripción indicada no existe.";
        }

        if (inscripcion.SocioId != socioId)
        {
            return "La inscripción no pertenece al socio indicado.";
        }

        if (inscripcion.Estado == EstadoInscripcion.Cancelada)
        {
            return "No se puede registrar asistencia para una inscripción cancelada.";
        }

        return null;
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
