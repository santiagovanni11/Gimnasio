using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MetodosPagoAlmacenadosController : ControllerBase
{
    private readonly AppDbContext _context;

    public MetodosPagoAlmacenadosController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Obtener([FromQuery] int socioId)
    {
        var metodos = await _context.MetodosPagoAlmacenados
            .Where(m => m.SocioId == socioId && m.Activo)
            .Select(m => new
            {
                m.Id, m.Marca, m.UltimosCuatro,
                m.MesVencimiento, m.AnioVencimiento,
            })
            .ToListAsync();

        return Ok(metodos);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(MetodoPagoAlmacenado metodo)
    {
        var socio = await _context.Socios.FindAsync(metodo.SocioId);
        if (socio == null) return BadRequest("El socio no existe.");

        metodo.Token = Guid.NewGuid().ToString("N");
        metodo.FechaCreacion = DateTime.UtcNow;
        _context.MetodosPagoAlmacenados.Add(metodo);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            metodo.Id, metodo.Marca, metodo.UltimosCuatro,
            metodo.MesVencimiento, metodo.AnioVencimiento,
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var metodo = await _context.MetodosPagoAlmacenados.FindAsync(id);
        if (metodo == null) return NotFound();

        metodo.Activo = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
