using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = RolesGimnasio.Administrador)]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: api/Roles
    // Solo Administrador.
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rol>>> GetRoles()
    {
        var roles = await _context.Roles
            .ToListAsync();

        return Ok(roles);
    }

    // =========================================================
    // GET: api/Roles/5
    // Solo Administrador.
    // =========================================================

    [HttpGet("{id}")]
    public async Task<ActionResult<Rol>> GetRol(int id)
    {
        var rol = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rol == null)
        {
            return NotFound();
        }

        return Ok(rol);
    }

    // =========================================================
    // GET: api/Roles/registro
    //
    // Público.
    //
    // Devuelve los roles activos disponibles
    // para crear una cuenta:
    // - Administrador
    // - Recepcionista
    // - Profesor
    // =========================================================

    [HttpGet("registro")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRolesRegistro()
    {
        var roles = await _context.Roles
            .Where(r =>
                r.Activo &&
                RolesGimnasio.RegistroPermitido.Contains(r.Nombre))
            .Select(r => new
            {
                r.Id,
                r.Nombre,
                r.Activo
            })
            .OrderBy(r => r.Id)
            .ToListAsync();

        return Ok(roles);
    }

    // =========================================================
    // POST: api/Roles
    // Solo Administrador.
    // =========================================================

    [HttpPost]
    public async Task<ActionResult<Rol>> PostRol(Rol rol)
    {
        if (string.IsNullOrWhiteSpace(rol.Nombre))
        {
            return BadRequest(
                "El nombre del rol es obligatorio.");
        }

        if (string.IsNullOrWhiteSpace(rol.Descripcion))
        {
            return BadRequest(
                "La descripción del rol es obligatoria.");
        }

        var nombreNormalizado = rol.Nombre.Trim();

        var existe = await _context.Roles
            .AnyAsync(r =>
                r.Nombre.ToLower() ==
                nombreNormalizado.ToLower());

        if (existe)
        {
            return BadRequest(
                "Ya existe un rol con ese nombre.");
        }

        rol.Nombre = nombreNormalizado;
        rol.Activo = true;

        _context.Roles.Add(rol);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetRol),
            new { id = rol.Id },
            rol);
    }
}

