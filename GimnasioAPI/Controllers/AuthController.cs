using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Extensions;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Autenticación: login de cuentas. El alta por invitación
/// vive en la parte Registro; la gestión de la propia
/// contraseña, en la parte Cuenta. La generación del JWT,
/// en TokenService; el bloqueo por intentos fallidos, en
/// LoginGuardService; el límite de tasa por IP, en la
/// política "auth" del rate limiter.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting(ConfiguracionRateLimiter.PoliticaAuth)]
public partial class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly LoginGuardService _guardLogin;
    private readonly AuditoriaUsuariosService _auditoria;
    private readonly CreacionUsuariosService _altas;
    private readonly EnvioEmailService _email;

    public AuthController(
        AppDbContext context,
        TokenService tokenService,
        LoginGuardService guardLogin,
        AuditoriaUsuariosService auditoria,
        CreacionUsuariosService altas,
        EnvioEmailService email)
    {
        _context = context;
        _tokenService = tokenService;
        _guardLogin = guardLogin;
        _auditoria = auditoria;
        _altas = altas;
        _email = email;
    }

    // =========================================================
    // POST: api/Auth/login
    // =========================================================

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponseDto>> Login(
        LoginDto login)
    {
        if (string.IsNullOrWhiteSpace(login.Email) ||
            string.IsNullOrWhiteSpace(login.Password))
        {
            return BadRequest(
                "Email y contraseña son obligatorios.");
        }

        var emailNormalizado = login.Email.Trim();

        var usuario = await _context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(
                u => u.Email.ToLower() ==
                     emailNormalizado.ToLower());

        if (usuario == null)
        {
            return Unauthorized(
                "Email o contraseña incorrectos.");
        }

        var mensajeBloqueo =
            _guardLogin.ObtenerMensajeBloqueo(usuario);

        if (mensajeBloqueo != null)
        {
            return Unauthorized(mensajeBloqueo);
        }

        if (!BCrypt.Net.BCrypt.Verify(
                login.Password, usuario.PasswordHash))
        {
            var quedoBloqueada = await _guardLogin
                .RegistrarFalloAsync(_context, usuario);

            await AuditarAccesoAsync(
                AccionesAuditoriaUsuario.AccesoFallido,
                usuario,
                quedoBloqueada
                    ? "Cuenta bloqueada por intentos fallidos."
                    : null);

            return Unauthorized(
                "Email o contraseña incorrectos.");
        }

        if (!usuario.Activo)
        {
            return Unauthorized("El usuario está desactivado.");
        }

        if (usuario.Rol == null || !usuario.Rol.Activo)
        {
            return Unauthorized(
                "El rol del usuario no está disponible.");
        }

        _guardLogin.RegistrarAcceso(usuario);
        await _context.SaveChangesAsync();

        await AuditarAccesoAsync(
            AccionesAuditoriaUsuario.AccesoExitoso, usuario);

        return Ok(new LoginResponseDto
        {
            Token = _tokenService.GenerarToken(usuario),
            UsuarioId = usuario.Id,
            Email = usuario.Email,
            RolId = usuario.RolId,
            RolNombre = usuario.Rol.Nombre,
            Nombre = usuario.Nombre,
            Apellido = usuario.Apellido,
            Expira = _tokenService.CalcularExpiracion()
        });
    }

    /// <summary>
    /// Registra en auditoría los accesos al sistema con la IP
    /// de origen. No interrumpe el flujo si falla el registro.
    /// </summary>
    private async Task AuditarAccesoAsync(
        string accion,
        Usuario usuario,
        string? detalle = null)
    {
        try
        {
            var ip = HttpContext.Connection.RemoteIpAddress;

            detalle = detalle is null
                ? $"IP {ip}"
                : $"{detalle} · IP {ip}";

            await _auditoria.RegistrarAsync(
                _context, accion, usuario, detalle);
        }
        catch (Exception)
        {
            // La auditoría no debe impedir el login.
        }
    }
}
