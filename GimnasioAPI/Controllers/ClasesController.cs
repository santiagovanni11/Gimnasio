using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class ClasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClasesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Clases
    // Todos los roles pueden consultar clases.
    [HttpGet]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<ActionResult<IEnumerable<Clase>>> GetClases()
    {
        return await _context.Clases
            .ToListAsync();
    }

    // GET: api/Clases/5
    // Todos los roles pueden consultar una clase.
    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
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
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<Clase>> CrearClase(Clase clase)
    {
        var errorCampos = ValidarCampos(clase);

        if (errorCampos != null)
        {
            return errorCampos;
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
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> ActualizarClase(
        int id,
        Clase clase)
    {
        if (id != clase.Id)
        {
            return BadRequest();
        }

        var errorCampos = ValidarCampos(clase);

        if (errorCampos != null)
        {
            return errorCampos;
        }

        _context.Entry(clase).State =
            EntityState.Modified;

        var resultado = await _context.GuardarAsync(
            () => ClaseExisteAsync(id));

        if (resultado != null)
        {
            return resultado;
        }

        return NoContent();
    }

    // DELETE: api/Clases/5 — vive en ClasesController.Bajas.cs
    // (validación de referencias + cascada consentida).

    private Task<bool> ClaseExisteAsync(int id)
    {
        return _context.Clases
            .AnyAsync(c => c.Id == id);
    }

    /// <summary>
    /// Rango válido de una clase: duración y capacidad positivas.
    /// Devuelve el BadRequest correspondiente o null si es válida.
    /// </summary>
    private BadRequestObjectResult? ValidarCampos(Clase clase)
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

        return null;
    }
}