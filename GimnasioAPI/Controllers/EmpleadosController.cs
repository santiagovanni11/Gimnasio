using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Gestión de empleados. Las validaciones de campos viven en
/// EmpleadoValidaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class EmpleadosController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmpleadosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
    {
        return await _context.Empleados
            .Where(e => e.Activo)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<Empleado>> GetEmpleado(int id)
    {
        var empleado = await _context.Empleados
            .FirstOrDefaultAsync(e => e.Id == id);

        if (empleado == null)
        {
            return NotFound();
        }

        return empleado;
    }

    [HttpPost]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<ActionResult<Empleado>> PostEmpleado(
        Empleado empleado)
    {
        var error = EmpleadoValidaciones.ValidarDatos(empleado);

        if (error != null)
        {
            return BadRequest(error);
        }

        if (await DniEnUsoAsync(empleado.DNI))
        {
            return BadRequest("Ya existe un empleado con ese DNI.");
        }

        empleado.FechaIngreso = DateTime.UtcNow;
        empleado.Activo = true;

        _context.Empleados.Add(empleado);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetEmpleado),
            new { id = empleado.Id },
            empleado);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> PutEmpleado(
        int id,
        Empleado empleado)
    {
        if (id != empleado.Id)
        {
            return BadRequest();
        }

        var error = EmpleadoValidaciones.ValidarDatos(empleado);

        if (error != null)
        {
            return BadRequest(error);
        }

        var existe = await _context.Empleados
            .AnyAsync(e => e.Id == id);

        if (!existe)
        {
            return NotFound();
        }

        if (await DniEnUsoAsync(empleado.DNI, excluirId: id))
        {
            return BadRequest("Ya existe otro empleado con ese DNI.");
        }

        _context.Entry(empleado).State =
            EntityState.Modified;

        var resultado = await _context.GuardarAsync(
            () => EmpleadoExistsAsync(id));

        if (resultado != null)
        {
            return resultado;
        }

        return NoContent();
    }

    /// <summary>Baja lógica: el empleado deja de estar activo.</summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> DeleteEmpleado(int id)
    {
        var empleado = await _context.Empleados
            .FirstOrDefaultAsync(e => e.Id == id);

        if (empleado == null)
        {
            return NotFound();
        }

        empleado.Activo = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Task<bool> EmpleadoExistsAsync(int id)
    {
        return _context.Empleados.AnyAsync(e => e.Id == id);
    }

    /// <summary>Unicidad de DNI, opcionalmente excluyendo un Id.</summary>
    private Task<bool> DniEnUsoAsync(string dni, int? excluirId = null)
        => _context.Empleados.AnyAsync(e =>
            e.DNI == dni &&
            (excluirId == null || e.Id != excluirId));
}
