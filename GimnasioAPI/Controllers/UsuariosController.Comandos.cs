using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Mutaciones de usuarios: alta, actualización, estado,
/// rol, reset de contraseña y baja física.
/// </summary>
public partial class UsuariosController
{
    // POST: api/Usuarios — Crear usuario manualmente.
    [HttpPost]
    public async Task<IActionResult> CrearUsuario(CrearUsuarioDto dto)
    {
        var resultado = await _altas.CrearAsync(dto);

        if (resultado.Error != null)
        {
            return BadRequest(resultado.Error);
        }

        var usuario = resultado.Usuario!;

        return CreatedAtAction(
            nameof(GetUsuario),
            new { id = usuario.Id },
            new
            {
                usuario.Id,
                usuario.Email,
                usuario.Nombre,
                usuario.Apellido,
                usuario.RolId,
                usuario.Activo,
                usuario.FechaCreacion
            });
    }

    // PUT: api/Usuarios/2 — Actualizar usuario.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarUsuario(
        int id,
        ActualizarUsuarioDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        var errorEmail = CredencialesValidator.ValidarEmail(
            dto.Email);

        if (!string.IsNullOrEmpty(errorEmail))
        {
            return BadRequest(errorEmail);
        }

        // Contraseña opcional en edición: vacía = sin cambio.
        var cambiaPassword =
            !string.IsNullOrWhiteSpace(dto.Password);

        var errorPassword = cambiaPassword
            ? CredencialesValidator.ValidarPassword(dto.Password)
            : string.Empty;

        if (!string.IsNullOrEmpty(errorPassword))
        {
            return BadRequest(errorPassword);
        }

        var emailNormalizado = dto.Email.Trim();

        if (await EmailEnUsoAsync(emailNormalizado, excluirId: id))
        {
            return BadRequest(
                "Ya existe otro usuario con ese email.");
        }

        if (!await RolActivoExisteAsync(dto.RolId))
        {
            return BadRequest(
                "El rol indicado no existe o está inactivo.");
        }

        // Evitar dejar al sistema sin Administradores:
        // sigue siendo admin pero pasa a inactivo.
        if (usuario.RolId == dto.RolId &&
            usuario.Activo &&
            !dto.Activo &&
            await _guard.EsUltimoAdministradorActivoAsync(usuario))
        {
            return BadRequest(
                "No se puede desactivar al último Administrador activo.");
        }

        usuario.Email = emailNormalizado;
        usuario.PasswordHash = cambiaPassword
            ? BCrypt.Net.BCrypt.HashPassword(dto.Password!)
            : usuario.PasswordHash;
        usuario.Nombre = dto.Nombre?.Trim();
        usuario.Apellido = dto.Apellido?.Trim();
        usuario.RolId = dto.RolId;
        usuario.Activo = dto.Activo;

        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaUsuario.Actualizacion,
            usuario);

        return Ok(new
        {
            usuario.Id,
            usuario.Email,
            usuario.Nombre,
            usuario.Apellido,
            usuario.RolId,
            usuario.Activo,
            usuario.FechaCreacion
        });
    }
}