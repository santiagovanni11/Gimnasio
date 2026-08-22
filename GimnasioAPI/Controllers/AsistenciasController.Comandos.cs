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
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
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
                    "No se puede registrar asistencia para una inscripción cancelada.");
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

        asistencia.Fecha = asistencia.Fecha == default
            ? DateTime.UtcNow
            : asistencia.Fecha;

        _context.Asistencias.Add(asistencia);
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