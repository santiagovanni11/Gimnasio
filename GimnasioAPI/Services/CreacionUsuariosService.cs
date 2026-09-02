using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Services;

/// <summary>
/// Resultado de un intento de alta de usuario.
/// Error != null indica el motivo del rechazo y no hay usuario.
/// </summary>
public class ResultadoAltaUsuario
{
    public string? Error { get; init; }
    public Usuario? Usuario { get; init; }
    public Rol? Rol { get; init; }
}

/// <summary>
/// Alta de cuentas compartida por el registro público y por la
/// creación manual desde gestión de usuarios: valida
/// credenciales, unicidad de email y rol activo, crea la
/// cuenta con contraseña hasheada y deja registro de auditoría.
/// </summary>
public class CreacionUsuariosService
{
    private readonly AppDbContext _context;
    private readonly AuditoriaUsuariosService _auditoria;

    public CreacionUsuariosService(
        AppDbContext context,
        AuditoriaUsuariosService auditoria)
    {
        _context = context;
        _auditoria = auditoria;
    }

    /// <summary>
    /// Crea el usuario descrito por el DTO. politicaRol permite
    /// al llamador aplicar restricciones adicionales sobre el
    /// rol (por ejemplo, roles admitidos en el registro público).
    /// </summary>
    public async Task<ResultadoAltaUsuario> CrearAsync(
        CrearUsuarioDto dto,
        Func<Rol, string?>? politicaRol = null)
    {
        var error = CredencialesValidator.ValidarEmail(dto.Email);

        if (!string.IsNullOrEmpty(error))
        {
            return Fallar(error);
        }

        error = CredencialesValidator.ValidarPassword(
            dto.Password);

        if (!string.IsNullOrEmpty(error))
        {
            return Fallar(error);
        }

        var emailNormalizado = dto.Email.Trim();

        if (await EmailEnUsoAsync(emailNormalizado))
        {
            return Fallar(
                "Ya existe un usuario con ese email.");
        }

        var rol = await _context.Roles.FirstOrDefaultAsync(
            r => r.Id == dto.RolId && r.Activo);

        if (rol == null)
        {
            return Fallar(
                "El rol indicado no existe o está inactivo.");
        }

        if (politicaRol != null)
        {
            error = politicaRol(rol);

            if (error != null)
            {
                return Fallar(error);
            }
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

        return new ResultadoAltaUsuario
        {
            Usuario = usuario,
            Rol = rol
        };
    }

    private static ResultadoAltaUsuario Fallar(string error)
    {
        return new ResultadoAltaUsuario { Error = error };
    }

    private Task<bool> EmailEnUsoAsync(string email)
    {
        return _context.Usuarios.AnyAsync(u =>
            u.Email.ToLower() == email.ToLower());
    }
}
