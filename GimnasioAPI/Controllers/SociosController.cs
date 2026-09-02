using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
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
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<IActionResult> GetSocios()
    {
        var hoy = DateTime.UtcNow.Date;
        var limitePorVencer = hoy.AddDays(7);

        var sinAcceso = await _context.Membresias
            .SinAccesoAClases(hoy)
            .Select(m => m.SocioId)
            .Distinct()
            .ToListAsync();

        var sinAccesoIds = new HashSet<int>(sinAcceso);

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
                s.FotoUrl,
                s.ContactoEmergencia,
                s.TelefonoEmergencia,
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

        // El flag se calcula en memoria: sin acceso a clases cuando
        // la membresía vigente tiene un plan que NO incluye el
        // beneficio "Acceso a clases".
        var resultado = socios
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
                s.FotoUrl,
                s.ContactoEmergencia,
                s.TelefonoEmergencia,
                s.FechaAlta,
                s.Activo,
                s.Membresia,
                SinAccesoAClases = sinAccesoIds.Contains(s.Id),
            })
            .ToList();

        return Ok(resultado);
    }

    // =========================================================
    // GET: api/Socios/5
    // =========================================================

    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
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
