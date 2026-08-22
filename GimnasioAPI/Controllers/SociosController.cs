using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de socios (GET). Las mutaciones viven en la parte
/// Comandos; las validaciones, en SocioValidaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class SociosController : ControllerBase
{
    private readonly AppDbContext _context;

    public SociosController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: api/Socios
    // Administrador, Recepcionista y Profesor pueden consultar.
    // Devuelve TODOS los socios (activos e inactivos) con su
    // última membresía. El frontend decide la visibilidad.
    // =========================================================

    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<IActionResult> GetSocios()
    {
        var hoy = DateTime.UtcNow.Date;
        var limitePorVencer = hoy.AddDays(7);

        var socios = await _context.Socios
            .Select(s => new
            {
                s.Id,
                s.Nombre,
                s.Apellido,
                s.DNI,
                s.FechaNacimiento,
                s.Telefono,
                s.Email,
                s.Direccion,
                s.FechaAlta,
                s.Activo,

                Membresia = _context.Membresias
                    .Where(m => m.SocioId == s.Id)
                    .OrderByDescending(m => m.FechaFin)
                    .ThenByDescending(m => m.Id)
                    .Select(m => new
                    {
                        m.Id,
                        m.FechaInicio,
                        m.FechaFin,
                        m.PrecioAplicado,

                        Estado =
                            m.FechaFin < hoy
                                ? "Vencida"
                                : m.FechaFin <= limitePorVencer
                                    ? "Por vencer"
                                    : "Vigente"
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(socios);
    }

    // =========================================================
    // GET: api/Socios/5
    // =========================================================

    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<Socio>> GetSocio(int id)
    {
        var socio = await _context.Socios
            .FirstOrDefaultAsync(s => s.Id == id);

        if (socio == null)
        {
            return NotFound();
        }

        return socio;
    }
}
