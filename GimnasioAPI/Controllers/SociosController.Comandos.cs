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
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<ActionResult<Socio>> CrearSocio(Socio socio)
    {
        var errorValidacion = SocioValidaciones.ValidarDatos(socio);

        if (errorValidacion != null)
        {
            return BadRequest(errorValidacion);
        }

        var dniNormalizado = socio.DNI.Trim();

        var dniExiste = await _context.Socios
            .AnyAsync(s => s.DNI == dniNormalizado);

        if (dniExiste)
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
    [Authorize(Roles = "Administrador,Recepcionista")]
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

        var dniExiste = await _context.Socios
            .AnyAsync(s =>
                s.DNI == dniNormalizado && s.Id != id);

        if (dniExiste)
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
        existente.Activo = socio.Activo;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // =========================================================
    // DELETE: api/Socios/5 — Solo Administrador.
    // Borrado físico del socio y sus datos dependientes.
    // =========================================================

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> EliminarSocio(int id)
    {
        var socio = await _context.Socios
            .FirstOrDefaultAsync(s => s.Id == id);

        if (socio == null)
        {
            return NotFound();
        }

        _context.Socios.Remove(socio);
        await _context.SaveChangesAsync();

        return NoContent();
    }

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
}
