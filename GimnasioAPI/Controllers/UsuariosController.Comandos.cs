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
        var error = ValidarCredenciales(dto.Email, dto.Password);

        if (!string.IsNullOrEmpty(error))
        {
            return BadRequest(error);
        }

        var emailNormalizado = dto.Email.Trim();

        if (await EmailEnUsoAsync(emailNormalizado))
        {
            return BadRequest("Ya existe un usuario con ese email.");
        }

        if (!await RolActivoExisteAsync(dto.RolId))
        {
            return BadRequest(
                "El rol indicado no existe o está inactivo.");
        }

        var usuario = new Usuario
        {
            Email = emailNormalizado,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Nombre = dto.Nombre?.Trim(),
            Apellido = dto.Apellido?.Trim(),
            RolId = dto.RolId,
            FechaCreacion = DateTime.UtcNow,
            Activo = true
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context, AccionesAuditoriaUsuario.Creacion, usuario);

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

        var error = ValidarCredenciales(dto.Email, dto.Password);

        if (!string.IsNullOrEmpty(error))
        {
            return BadRequest(error);
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
        usuario.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(dto.Password);
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