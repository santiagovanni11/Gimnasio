using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de socios: alta, actualización y baja física.
/// </summary>
public partial class SociosController
{
    // =========================================================
    // POST: api/Socios
    // Administrador y Recepcionista pueden crear.
    // =========================================================

    [HttpPost]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<Socio>> CrearSocio(Socio socio)
    {
        var errorValidacion = SocioValidaciones.ValidarDatos(socio);

        if (errorValidacion != null)
        {
            return BadRequest(errorValidacion);
        }

        var dniNormalizado = socio.DNI.Trim();

        if (await DniEnUsoAsync(dniNormalizado))
        {
            return BadRequest("Ya existe un socio con ese DNI.");
        }

        NormalizarDatos(socio);

        socio.FechaAlta = DateTime.UtcNow;
        socio.Activo = true;

        _context.Socios.Add(socio);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetSocio),
            new { id = socio.Id },
            socio);
    }

    // =========================================================
    // PUT: api/Socios/5
    // Administrador y Recepcionista pueden modificar.
    // =========================================================

    [HttpPut("{id}")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> ActualizarSocio(
        int id,
        Socio socio)
    {
        if (id != socio.Id)
        {
            return BadRequest(
                "El ID de la URL no coincide con el ID del socio.");
        }

        var errorValidacion = SocioValidaciones.ValidarDatos(socio);

        if (errorValidacion != null)
        {
            return BadRequest(errorValidacion);
        }

        var existente = await _context.Socios
            .FirstOrDefaultAsync(s => s.Id == id);

        if (existente == null)
        {
            return NotFound("El socio no existe.");
        }

        var dniNormalizado = socio.DNI.Trim();

        if (await DniEnUsoAsync(dniNormalizado, excluirId: id))
        {
            return BadRequest("Ya existe otro socio con ese DNI.");
        }

        existente.Nombre = socio.Nombre.Trim();
        existente.Apellido = socio.Apellido.Trim();
        existente.DNI = dniNormalizado;
        existente.FechaNacimiento = socio.FechaNacimiento;
        existente.Telefono = socio.Telefono.Trim();
        existente.Email = socio.Email.Trim();
        existente.Direccion =
            string.IsNullOrWhiteSpace(socio.Direccion)
                ? null
                : socio.Direccion.Trim();
        existente.FotoUrl =
            string.IsNullOrWhiteSpace(socio.FotoUrl)
                ? null
                : socio.FotoUrl.Trim();
        existente.ContactoEmergencia =
            string.IsNullOrWhiteSpace(socio.ContactoEmergencia)
                ? null
                : socio.ContactoEmergencia.Trim();
        existente.TelefonoEmergencia =
            string.IsNullOrWhiteSpace(socio.TelefonoEmergencia)
                ? null
                : socio.TelefonoEmergencia.Trim();
        existente.Activo = socio.Activo;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // =========================================================
    // BAJA DE SOCIOS
    // La baja es SIEMPRE lógica (PUT con Activo=false): el socio
    // conserva su historial de membresías, pagos y asistencias.
    // No existe borrado físico justamente para no perder ese
    // historial contable.
    // =========================================================

    private static void NormalizarDatos(Socio socio)
    {
        socio.Nombre = socio.Nombre.Trim();
        socio.Apellido = socio.Apellido.Trim();
        socio.DNI = socio.DNI.Trim();
        socio.Telefono = socio.Telefono.Trim();
        socio.Email = socio.Email.Trim();
        socio.Direccion =
            string.IsNullOrWhiteSpace(socio.Direccion)
                ? null
                : socio.Direccion.Trim();
    }

    /// <summary>Unicidad de DNI, opcionalmente excluyendo un Id.</summary>
    private Task<bool> DniEnUsoAsync(string dni, int? excluirId = null)
    {
        return _context.Socios.AnyAsync(s =>
            s.DNI == dni &&
            (excluirId == null || s.Id != excluirId));
    }
}
