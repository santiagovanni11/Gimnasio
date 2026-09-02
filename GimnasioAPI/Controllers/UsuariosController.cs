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
[Authorize(Roles = RolesGimnasio.Administrador)]
public partial class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AdministradorGuardService _guard;
    private readonly AuditoriaUsuariosService _auditoria;
    private readonly CreacionUsuariosService _altas;

    public UsuariosController(
        AppDbContext context,
        AdministradorGuardService guard,
        AuditoriaUsuariosService auditoria,
        CreacionUsuariosService altas)
    {
        _context = context;
        _guard = guard;
        _auditoria = auditoria;
        _altas = altas;
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
                u.Rol.Nombre == RolesGimnasio.Administrador
                    ? 1
                    : u.Rol != null &&
                      u.Rol.Nombre == RolesGimnasio.Recepcionista
                          ? 2
                          : u.Rol != null &&
                            u.Rol.Nombre == RolesGimnasio.Profesor
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
