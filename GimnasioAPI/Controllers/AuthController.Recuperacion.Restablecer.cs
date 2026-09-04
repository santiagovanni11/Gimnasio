using GimnasioAPI.DTOs;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Recuperación de contraseña por código enviado al email,
/// paso 2: validación del código y nueva contraseña.
/// </summary>
public partial class AuthController
{
    private const int MaxIntentosCodigo = 5;

    private const string CodigoInvalido =
        "El código es incorrecto o venció.";

    // =========================================================
    // POST: api/Auth/restablecer-password
    // =========================================================

    [HttpPost("restablecer-password")]
    [AllowAnonymous]
    public async Task<IActionResult> RestablecerPassword(
        RestablecerPasswordDto dto)
    {
        var error = CredencialesValidator.ValidarPassword(
            dto.PasswordNueva);

        if (!string.IsNullOrEmpty(error))
        {
            return BadRequest(error);
        }

        var emailNormalizado = dto.Email.Trim();

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(
                u => u.Email.ToLower() ==
                     emailNormalizado.ToLower());

        if (usuario == null)
        {
            return BadRequest(CodigoInvalido);
        }

        var codigo = await _context.CodigosRecuperacion
            .Where(c => c.UsuarioId == usuario.Id && !c.Usado)
            .OrderByDescending(c => c.FechaCreacionUtc)
            .FirstOrDefaultAsync();

        if (codigo == null ||
            codigo.ExpiraUtc < DateTime.UtcNow ||
            codigo.Intentos >= MaxIntentosCodigo)
        {
            return BadRequest(CodigoInvalido);
        }

        if (!BCrypt.Net.BCrypt.Verify(
                dto.Codigo, codigo.CodigoHash))
        {
            codigo.Intentos++;
            await _context.SaveChangesAsync();

            return BadRequest(CodigoInvalido);
        }

        // Código correcto: se consume y se restablece el acceso.
        codigo.Usado = true;

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(
            dto.PasswordNueva);

        _guardLogin.RegistrarAcceso(usuario);

        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaUsuario.ResetPassword,
            usuario,
            "Restablecimiento con código por email.");

        return Ok(new
        {
            Mensaje = "Contraseña actualizada. Ya podés " +
                "iniciar sesión."
        });
    }
}
