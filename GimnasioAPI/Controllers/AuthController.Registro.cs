using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Alta pública de cuentas con nombre, apellido y rol.
/// </summary>
public partial class AuthController
{
    // =========================================================
    // POST: api/Auth/registro
    // =========================================================

    [HttpPost("registro")]
    [AllowAnonymous]
    public async Task<IActionResult> RegistrarUsuario(
        CrearUsuarioDto dto)
    {
        var error =
            CredencialesValidator.ValidarEmail(dto.Email);

        if (!string.IsNullOrEmpty(error)) return BadRequest(error);

        error = CredencialesValidator.ValidarPassword(
            dto.Password);

        if (!string.IsNullOrEmpty(error)) return BadRequest(error);

        var emailNormalizado = dto.Email.Trim();

        if (await _context.Usuarios.AnyAsync(u =>
                u.Email.ToLower() ==
                emailNormalizado.ToLower()))
        {
            return BadRequest(
                "Ya existe un usuario con ese email.");
        }

        var rol = await _context.Roles.FirstOrDefaultAsync(
            r => r.Id == dto.RolId && r.Activo);

        if (rol == null)
        {
            return BadRequest(
                "El rol indicado no existe o está inactivo.");
        }

        if (!EsRolDeRegistroPermitido(rol.Nombre))
        {
            return BadRequest(
                "El rol seleccionado no está permitido.");
        }

        var usuario = new Usuario
        {
            Email = emailNormalizado,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Nombre = dto.Nombre?.Trim(),
            Apellido = dto.Apellido?.Trim(),
            RolId = rol.Id,
            FechaCreacion = DateTime.UtcNow,
            Activo = true
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaUsuario.Creacion,
            usuario,
            detalle: $"Rol {rol.Nombre}.");

        return Created(
            $"api/Usuarios/{usuario.Id}",
            new
            {
                usuario.Id,
                usuario.Email,
                usuario.Nombre,
                usuario.Apellido,
                usuario.RolId,
                RolNombre = rol.Nombre,
                usuario.Activo,
                usuario.FechaCreacion
            });
    }

    private static bool EsRolDeRegistroPermitido(string nombreRol) =>
        nombreRol == "Administrador" ||
        nombreRol == "Recepcionista" ||
        nombreRol == "Profesor";
}
