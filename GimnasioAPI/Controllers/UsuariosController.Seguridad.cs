using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Seguridad de usuarios: estado, rol, password y baja.
/// </summary>
public partial class UsuariosController
{
    // PUT: api/Usuarios/2/estado — Activa/desactiva (baja lógica).
    [HttpPut("{id:int}/estado")]
    public async Task<IActionResult> CambiarEstadoUsuario(
        int id,
        [FromBody] bool activo)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        if (!activo && usuario.Activo &&
            await _guard.EsUltimoAdministradorActivoAsync(usuario))
        {
            return BadRequest(
                "No se puede desactivar al último Administrador activo.");
        }

        usuario.Activo = activo;
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context, AccionesAuditoriaUsuario.CambioEstado,
            usuario, detalle: $"Activo = {activo}");

        return NoContent();
    }

    // PUT: api/Usuarios/2/rol — Cambia el rol (protege al último Admin activo).
    [HttpPut("{id:int}/rol")]
    public async Task<IActionResult> CambiarRolUsuario(
        int id,
        [FromBody] CambiarRolDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        var rolNuevo = await _context.Roles
            .FirstOrDefaultAsync(r =>
                r.Id == dto.RolId && r.Activo);

        if (rolNuevo == null)
        {
            return BadRequest("El rol indicado no existe o está inactivo.");
        }

        if (usuario.RolId == rolNuevo.Id)
        {
            return BadRequest("El usuario ya tiene ese rol.");
        }

        // Evitar dejar al sistema sin Administradores.
        var dejaDeSerAdmin =
            await _guard.EsRolAdministradorAsync(usuario.RolId) &&
            rolNuevo.Nombre != "Administrador";

        if (dejaDeSerAdmin && usuario.Activo &&
            await _guard.EsUltimoAdministradorActivoAsync(usuario))
        {
            return BadRequest("No se puede cambiar el rol del último Administrador activo.");
        }

        usuario.RolId = rolNuevo.Id;
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context, AccionesAuditoriaUsuario.CambioRol,
            usuario, detalle: $"Nuevo rol: {rolNuevo.Nombre}");

        return NoContent();
    }

    // PUT: api/Usuarios/2/password — Reset de contraseña.
    [HttpPut("{id:int}/password")]
    public async Task<IActionResult> ResetearPassword(
        int id,
        [FromBody] PasswordDto dto)
    {
        var error =
            CredencialesValidator.ValidarPassword(dto.Password);

        if (!string.IsNullOrEmpty(error))
        {
            return BadRequest(error);
        }

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context, AccionesAuditoriaUsuario.ResetPassword,
            usuario);

        return NoContent();
    }

    // DELETE: api/Usuarios/2 — Borrado físico del usuario.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarUsuario(int id)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);

        if (usuario == null)
        {
            return NotFound();
        }

        if (usuario.Activo &&
            await _guard.EsUltimoAdministradorActivoAsync(usuario))
        {
            return BadRequest("No se puede eliminar al último Administrador activo.");
        }

        // Snapshot para la auditoría (sobrevive al borrado).
        var emailBaja = usuario.Email;
        var rolIdBaja = usuario.RolId;

        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context, AccionesAuditoriaUsuario.Eliminacion,
            new Usuario { Id = id, Email = emailBaja },
            detalle: $"RolId={rolIdBaja}");

        return NoContent();
    }
}
