using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de asistencias: registro, actualización y baja.
/// </summary>
public partial class AsistenciasController
{
    // POST: api/Asistencias
    [HttpPost]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<AsistenciaDto>> PostAsistencia(
        Asistencia asistencia)
    {
        var socio = await _context.Socios
            .FirstOrDefaultAsync(s =>
                s.Id == asistencia.SocioId && s.Activo);

        if (socio == null)
        {
            return BadRequest(
                "El socio no existe o está inactivo.");
        }

        InscripcionClase? inscripcion = null;

        if (asistencia.InscripcionClaseId.HasValue)
        {
            inscripcion = await CargarInscripcionCompleta(
                asistencia.InscripcionClaseId.Value);

            var error = ValidarInscripcionDeAsistencia(
                inscripcion,
                asistencia.SocioId);

            if (error != null)
            {
                return BadRequest(error);
            }

            // Evitar duplicados por inscripción y fecha.
            var duplicada = await ExisteDuplicadaAsync(
                asistencia.InscripcionClaseId,
                asistencia.Fecha.Date,
                excluirId: null);

if (duplicada)
            {
                return BadRequest(
                    "Ya existe una asistencia registrada para este socio en esta inscripción y fecha.");
            }
        }
        else
        {
            // Asistencia general (sin inscripción): evitar
            // duplicados por el mismo socio en el mismo día.
            var marcaDelDia = await _context.Asistencias.AnyAsync(
                a => a.SocioId == asistencia.SocioId &&
                     a.Fecha.Date == asistencia.Fecha.Date);

            if (marcaDelDia)
            {
                return BadRequest(
                    "Ya existe una asistencia para este socio en esa fecha.");
            }
        }

asistencia.Fecha = asistencia.Fecha == default
            ? DateTime.UtcNow
            : asistencia.Fecha;

        AplicarAuditoria(asistencia);

        _context.Asistencias.Add(asistencia);

        // Refleja el estado en la inscripción: asistió o no.
        if (inscripcion != null)
        {
            inscripcion.Estado = asistencia.Presente
                ? EstadoInscripcion.Asistio
                : EstadoInscripcion.NoAsistio;
        }

        await _context.SaveChangesAsync();

        var resultado = MapearDto(asistencia);
        resultado.SocioNombre = socio.Nombre;
        resultado.SocioApellido = socio.Apellido;
        resultado.ClaseNombre =
            inscripcion?.HorarioClase?.Clase?.Nombre;

        return CreatedAtAction(
            nameof(GetAsistencia),
            new { id = asistencia.Id },
            resultado);
    }
}