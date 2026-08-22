using System.Security.Claims;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Gestión de la propia cuenta del usuario autenticado.
/// </summary>
public partial class AuthController
{
    // =========================================================
    // PUT: api/Auth/password
    //
    // Cambio de la propia contraseña: exige la vigente y que
    // la nueva sea distinta.
    // =========================================================

    [HttpPut("password")]
    [Authorize]
    public async Task<IActionResult> CambiarMiPassword(
        CambiarPasswordPropioDto dto)
    {
        var error = CredencialesValidator.ValidarPassword(
            dto.PasswordNueva);

        if (!string.IsNullOrEmpty(error))
        {
            return BadRequest(error);
        }

        var usuario = await ObtenerUsuarioAutenticadoAsync();

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        if (!BCrypt.Net.BCrypt.Verify(
                dto.PasswordActual, usuario.PasswordHash))
        {
            return BadRequest(
                "La contraseña actual es incorrecta.");
        }

        if (BCrypt.Net.BCrypt.Verify(
                dto.PasswordNueva, usuario.PasswordHash))
        {
            return BadRequest(
                "La nueva contraseña debe ser distinta de la actual.");
        }

        usuario.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(dto.PasswordNueva);

        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context,
            AccionesAuditoriaUsuario.CambioPasswordPropio,
            usuario);

        return NoContent();
    }

    /// <summary>
    /// Resuelve el Usuario de la request a partir del claim
    /// NameIdentifier del JWT; null si la sesión es inválida.
    /// </summary>
    private async Task<Usuario?>
        ObtenerUsuarioAutenticadoAsync()
    {
        var idTexto = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(idTexto, out var usuarioId))
        {
            return null;
        }

        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == usuarioId);
    }
}
