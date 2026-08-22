using GimnasioAPI.Data;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de usuarios del sistema (endpoints GET). Las
/// mutaciones viven en la parte Comandos; la protección de
/// "último Administrador activo", en AdministradorGuardService;
/// el historial de cambios, en la parte Auditoria.
/// Listado ordenado: Administrador -> Recepcionista -> Profesor.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrador")]
public partial class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AdministradorGuardService _guard;
    private readonly AuditoriaUsuariosService _auditoria;

    public UsuariosController(
        AppDbContext context,
        AdministradorGuardService guard,
        AuditoriaUsuariosService auditoria)
    {
        _context = context;
        _guard = guard;
        _auditoria = auditoria;
    }

    // =========================================================
    // GET: api/Usuarios
    // Lista todos los usuarios ordenados por rol:
    // Administrador -> Recepcionista -> Profesor.
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetUsuarios()
    {
        var usuarios = await _context.Usuarios
            .Include(u => u.Rol)
            .OrderBy(u =>
                u.Rol != null &&
                u.Rol.Nombre == "Administrador"
                    ? 1
                    : u.Rol != null &&
                      u.Rol.Nombre == "Recepcionista"
                          ? 2
                          : u.Rol != null &&
                            u.Rol.Nombre == "Profesor"
                                ? 3
                                : 4)
            .ThenBy(u => u.Email)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Nombre,
                u.Apellido,
                u.RolId,
                RolNombre = u.Rol != null ? u.Rol.Nombre : "",
                u.Activo,
                u.FechaCreacion,
                u.UltimoAcceso,
                u.BloqueadoHasta
            })
            .ToListAsync();

        return Ok(usuarios);
    }

    // =========================================================
    // GET: api/Usuarios/5
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUsuario(int id)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Rol)
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Nombre,
                u.Apellido,
                u.RolId,
                RolNombre = u.Rol != null ? u.Rol.Nombre : "",
                u.Activo,
                u.FechaCreacion,
                u.UltimoAcceso,
                u.BloqueadoHasta
            })
            .FirstOrDefaultAsync();

        if (usuario == null)
        {
            return NotFound();
        }

        return Ok(usuario);
    }

    // =========================================================
    // VALIDACIONES COMPARTIDAS
    // =========================================================

    private static string ValidarCredenciales(
        string? email,
        string? password)
    {
        var errorEmail =
            CredencialesValidator.ValidarEmail(email);

        if (!string.IsNullOrEmpty(errorEmail))
        {
            return errorEmail;
        }

        return CredencialesValidator.ValidarPassword(password);
    }

    private Task<bool> EmailEnUsoAsync(
        string email,
        int? excluirId = null)
    {
        return _context.Usuarios
            .AnyAsync(u =>
                u.Email.ToLower() == email.ToLower() &&
                (excluirId == null || u.Id != excluirId));
    }

    private Task<bool> RolActivoExisteAsync(int rolId)
    {
        return _context.Roles
            .AnyAsync(r => r.Id == rolId && r.Activo);
    }
}
