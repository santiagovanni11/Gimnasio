using System.Security.Cryptography;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Recuperación de contraseña por código enviado al email,
/// paso 1: solicitud del código. Las respuestas son genéricas
/// a propósito: no revelan si el email existe en el sistema.
/// El límite de tasa por IP lo aporta la política "auth".
/// </summary>
public partial class AuthController
{
    protected const int MinutosVidaCodigo = 10;

    // =========================================================
    // POST: api/Auth/recuperar-password
    // =========================================================

    [HttpPost("recuperar-password")]
    [AllowAnonymous]
    public async Task<IActionResult> RecuperarPassword(
        RecuperarPasswordDto dto)
    {
        var emailNormalizado = dto.Email.Trim();

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(
                u => u.Email.ToLower() ==
                     emailNormalizado.ToLower());

        if (usuario == null || !usuario.Activo)
        {
            return Ok(MensajeGenerico());
        }

        var codigo = GenerarCodigo();

        await InvalidarCodigosPreviosAsync(usuario.Id);

        _context.CodigosRecuperacion.Add(new CodigoRecuperacion
        {
            UsuarioId = usuario.Id,
            CodigoHash =
                BCrypt.Net.BCrypt.HashPassword(codigo),
            ExpiraUtc =
                DateTime.UtcNow.AddMinutes(MinutosVidaCodigo),
        });

        await _context.SaveChangesAsync();

        try
        {
            await _email.EnviarCodigoRecuperacionAsync(
                usuario.Email, codigo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Fallo el envío del email de recuperación a {Email}",
                usuario.Email);

            return StatusCode(503,
                "No se pudo enviar el email. Reintentá " +
                "en unos minutos.");
        }

        return Ok(MensajeGenerico());
    }

    /// <summary>Respuesta idéntica exista o no el email.</summary>
    private static object MensajeGenerico() => new
    {
        Mensaje = "Si el email existe, te enviamos un código. " +
            "Revisá tu bandeja (y el correo no deseado)."
    };

    private static string GenerarCodigo() =>
        RandomNumberGenerator.GetInt32(0, 1_000_000)
            .ToString("D6");

    /// <summary>Deja sin efecto los códigos activos previos.</summary>
    private async Task InvalidarCodigosPreviosAsync(int usuarioId)
    {
        var vigentes = await _context.CodigosRecuperacion
            .Where(c => c.UsuarioId == usuarioId && !c.Usado)
            .ToListAsync();

        foreach (var codigo in vigentes)
        {
            codigo.Usado = true;
        }
    }
}
