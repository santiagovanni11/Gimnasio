using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BeneficiosController : ControllerBase
{
    private readonly AppDbContext _context;

    public BeneficiosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Beneficios
    // Administrador, Recepcionista y Profesor pueden consultar.
    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<Beneficio>>> GetBeneficios()
    {
        return await _context.Beneficios
            .Where(b => b.Activo)
            .ToListAsync();
    }

    // GET: api/Beneficios/1
    // Administrador, Recepcionista y Profesor pueden consultar.
    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<Beneficio>> GetBeneficio(int id)
    {
        var beneficio = await _context.Beneficios
            .FirstOrDefaultAsync(b => b.Id == id);

        if (beneficio == null)
        {
            return NotFound();
        }

        return beneficio;
    }

    // POST: api/Beneficios
    // Administrador y Recepcionista pueden crear.
    [HttpPost]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<Beneficio>> PostBeneficio(
        Beneficio beneficio)
    {
        var error = BeneficioValidaciones.ValidarCampos(
            beneficio.Nombre, beneficio.Descripcion);

        if (error != null)
        {
            return BadRequest(error);
        }

        if (await NombreEnUsoAsync(beneficio.Nombre))
        {
            return BadRequest(
                "Ya existe un beneficio con ese nombre.");
        }

        beneficio.Activo = true;

        _context.Beneficios.Add(beneficio);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBeneficio),
            new { id = beneficio.Id },
            beneficio);
    }

    // PUT: api/Beneficios/1
    // Administrador y Recepcionista pueden modificar.
    [HttpPut("{id}")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> PutBeneficio(
        int id,
        Beneficio beneficio)
    {
        if (id != beneficio.Id)
        {
            return BadRequest();
        }

        var error = BeneficioValidaciones.ValidarCampos(
            beneficio.Nombre, beneficio.Descripcion);

        if (error != null)
        {
            return BadRequest(error);
        }

        var existente = await _context.Beneficios
            .FirstOrDefaultAsync(b => b.Id == id);

        if (existente == null)
        {
            return NotFound();
        }

        if (await NombreEnUsoAsync(beneficio.Nombre, excluirId: id))
        {
            return BadRequest(
                "Ya existe otro beneficio con ese nombre.");
        }

        existente.Nombre = beneficio.Nombre;
        existente.Descripcion = beneficio.Descripcion;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Beneficios/1
    // Baja lógica.
    // Solo Administrador puede eliminar.
    [HttpDelete("{id}")]
    [Authorize(Roles = RolesGimnasio.Administrador)]
    public async Task<IActionResult> DeleteBeneficio(int id)
    {
        var beneficio = await _context.Beneficios
            .FirstOrDefaultAsync(b => b.Id == id);

        if (beneficio == null)
        {
            return NotFound();
        }

        beneficio.Activo = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>Unicidad de nombre, opcionalmente excluyendo un Id.</summary>
    private Task<bool> NombreEnUsoAsync(string nombre, int? excluirId = null)
    {
        return _context.Beneficios.AnyAsync(b =>
            b.Nombre.ToLower() == nombre.ToLower() &&
            (excluirId == null || b.Id != excluirId));
    }
}

