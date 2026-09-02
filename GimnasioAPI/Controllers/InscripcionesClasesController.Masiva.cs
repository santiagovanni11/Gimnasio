using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>Alta masiva de inscripciones a un horario; reglas en Reglas*.</summary>
public partial class InscripcionesClasesController
{
    // POST: api/InscripcionesClases/masivo — Admin y Recepcionista.
    [HttpPost("masivo")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<ResultadoInscripcionMasivaDto>>
        PostInscripcionMasiva(InscripcionMasivaDto peticion)
    {
        var hoy = DateTime.UtcNow.Date;
        var sociosIds = peticion.SociosIds?.Where(id => id > 0)
            .Distinct().ToList() ?? new List<int>();

        if (sociosIds.Count == 0)
            return BadRequest(new ResultadoInscripcionMasivaDto
                { Errores = { "Seleccioná al menos un socio." } });
        var horario = await _context.HorariosClases
            .Include(h => h.Clase).Include(h => h.Empleado)
            .FirstOrDefaultAsync(h => h.Id == peticion.HorarioClaseId);

        if (horario == null) return BadRequest("El horario indicado no existe.");
        if (!horario.Activo) return BadRequest("El horario seleccionado está inactivo.");
        if (horario.Clase == null || !horario.Clase.Activa)
            return BadRequest("La clase seleccionada está inactiva.");

        if (peticion.FechaHasta.HasValue && peticion.FechaHasta.Value.Date < hoy)
            return BadRequest("La vigencia no puede ser una fecha pasada.");

        // Datos pre-cargados para validar cada socio sin N consultas.
        var sociosActivos = (await _context.Socios
            .Where(s => s.Activo && sociosIds.Contains(s.Id))
            .Select(s => s.Id).ToListAsync()).ToHashSet();

        var sinAccesoIds = (await _context.Membresias
            .SinAccesoAClases(hoy)
            .Where(m => sociosIds.Contains(m.SocioId))
            .Select(m => m.SocioId).ToListAsync()).ToHashSet();

        var ocupadosIds = (await _context.InscripcionesClases
            .Where(ReglasInscripcionClase.OcupaCupo(hoy))
            .Where(i => i.HorarioClaseId == horario.Id &&
                sociosIds.Contains(i.SocioId))
            .Select(i => i.SocioId).ToListAsync()).ToHashSet();

        var cantidadInscritos = await _context.InscripcionesClases
            .Where(ReglasInscripcionClase.OcupaCupo(hoy))
            .CountAsync(i => i.HorarioClaseId == horario.Id);

        var nombres = (await _context.Socios
            .Where(s => sociosIds.Contains(s.Id))
            .ToDictionaryAsync(s => s.Id,
                s => $"{s.Nombre} {s.Apellido}".Trim()));

        // Franjas activas de cada socio para detectar choques de horario.
        var franjasPorSocio = (await _context.InscripcionesClases
            .Where(ReglasInscripcionClase.OcupaCupo(hoy))
            .Where(i => sociosIds.Contains(i.SocioId))
            .Select(i => new
            {
                i.SocioId,
                i.HorarioClase!.DiaSemana,
                i.HorarioClase!.HoraInicio,
                i.HorarioClase!.HoraFin
            })
            .ToListAsync())
            .GroupBy(x => x.SocioId)
            .ToDictionary(g => g.Key,
                g => g.Select(x =>
                    (x.DiaSemana, x.HoraInicio, x.HoraFin)).ToList());

        var nuevas = new List<InscripcionClase>();
        var errores = new List<string>();
        foreach (var socioId in sociosIds)
        {
            if (!sociosActivos.Contains(socioId))
            {
                errores.Add($"{Etiqueta(socioId, nombres)}: el socio está inactivo.");
                continue;
            }
            if (sinAccesoIds.Contains(socioId))
            {
                errores.Add($"{Etiqueta(socioId, nombres)}: su plan no incluye acceso a clases.");
                continue;
            }
            if (ocupadosIds.Contains(socioId))
            {
                errores.Add($"{Etiqueta(socioId, nombres)}: ya está inscripto en este horario.");
                continue;
            }
            if (ChoqueFranja(socioId, horario, franjasPorSocio))
            {
                errores.Add($"{Etiqueta(socioId, nombres)}: ya está inscripto a otra clase el mismo día a la misma hora.");
                continue;
            }
            if (cantidadInscritos >= horario.Clase.CapacidadMaxima)
            {
                errores.Add($"{Etiqueta(socioId, nombres)}: la clase alcanzó su capacidad máxima.");
                continue;
            }

            ocupadosIds.Add(socioId);
            cantidadInscritos++;
            nuevas.Add(new InscripcionClase
            {
                SocioId = socioId,
                HorarioClaseId = horario.Id,
                FechaInscripcion = DateTime.UtcNow,
                FechaHasta = peticion.FechaHasta,
                Estado = EstadoInscripcion.Reservada,
            });
        }

        if (nuevas.Count > 0)
        {
            _context.InscripcionesClases.AddRange(nuevas);
            await _context.SaveChangesAsync();
        }

        return Ok(new ResultadoInscripcionMasivaDto
        {
            Inscriptos = nuevas.Count,
            Errores = errores,
        });
    }

private static string Etiqueta(
        int socioId, IReadOnlyDictionary<int, string> nombres) =>
        nombres.GetValueOrDefault(socioId, $"socio {socioId}");

    /// <summary>¿El socio ya ocupa una franja superpuesta ese día?</summary>
    private static bool ChoqueFranja(
        int socioId, HorarioClase horario,
        IReadOnlyDictionary<int, List<(DayOfWeek DiaSemana,
            TimeSpan HoraInicio, TimeSpan HoraFin)>> franjas) =>
        franjas.TryGetValue(socioId, out var franjasSocio) &&
        franjasSocio.Any(f =>
            f.DiaSemana == horario.DiaSemana &&
            f.HoraInicio < horario.HoraFin &&
            horario.HoraInicio < f.HoraFin);
}