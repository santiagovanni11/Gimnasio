using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClasesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Clases
    // Todos los roles pueden consultar clases.
    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<IEnumerable<Clase>>> GetClases()
    {
        return await _context.Clases
            .ToListAsync();
    }

    // GET: api/Clases/5
    // Todos los roles pueden consultar una clase.
    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<Clase>> GetClase(int id)
    {
        var clase = await _context.Clases
            .FindAsync(id);

        if (clase == null)
        {
            return NotFound();
        }

        return clase;
    }

    // POST: api/Clases
    // Administrador y Recepcionista pueden crear clases.
    [HttpPost]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<ActionResult<Clase>> CrearClase(Clase clase)
    {
        if (clase.DuracionMinutos <= 0)
        {
            return BadRequest(
                "La duración debe ser mayor a 0 minutos.");
        }

        if (clase.CapacidadMaxima <= 0)
        {
            return BadRequest(
                "La capacidad máxima debe ser mayor a 0.");
        }

        _context.Clases.Add(clase);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetClase),
            new { id = clase.Id },
            clase);
    }

    // PUT: api/Clases/5
    // Administrador y Recepcionista pueden modificar clases.
    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista")]
    public async Task<IActionResult> ActualizarClase(
        int id,
        Clase clase)
    {
        if (id != clase.Id)
        {
            return BadRequest();
        }

        if (clase.DuracionMinutos <= 0)
        {
            return BadRequest(
                "La duración debe ser mayor a 0 minutos.");
        }

        if (clase.CapacidadMaxima <= 0)
        {
            return BadRequest(
                "La capacidad máxima debe ser mayor a 0.");
        }

        _context.Entry(clase).State =
            EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ClaseExiste(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/Clases/5
    // Solo Administrador puede eliminar clases.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> EliminarClase(int id)
    {
        var clase = await _context.Clases
            .FindAsync(id);

        if (clase == null)
        {
            return NotFound();
        }

        _context.Clases.Remove(clase);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ClaseExiste(int id)
    {
        return _context.Clases
            .Any(c => c.Id == id);
    }
}