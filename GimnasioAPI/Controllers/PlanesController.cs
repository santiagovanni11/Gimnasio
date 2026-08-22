using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de planes (GET). Las mutaciones viven en la parte
/// Comandos; las validaciones, en PlanesValidaciones.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class PlanesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlanesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Planes
    [HttpGet]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<IEnumerable<PlanDto>>> GetPlanes()
    {
        // Aplica cambios de precio programados cuya fecha llegó.
        // Fail-safe: si la tabla de auditoría todavía no existe
        // (migración pendiente) el listado sigue funcionando.
        try
        {
            await AplicarPendientesVencidosAsync();
        }
        catch
        {
            // Sin auditoría disponible: continuar normalmente.
        }

        var planes = await CargarConRelaciones().ToListAsync();
        return Ok(planes.Select(MapearDto));
    }

    // GET: api/Planes/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Administrador,Recepcionista,Profesor")]
    public async Task<ActionResult<PlanDto>> GetPlan(int id)
    {
        var plan = await CargarConRelaciones()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (plan == null)
        {
            return NotFound();
        }

        return Ok(MapearDto(plan));
    }

    private IQueryable<Plan> CargarConRelaciones()
    {
        return _context.Planes
            .Include(p => p.PlanesBeneficios)
                .ThenInclude(pb => pb.Beneficio)
            .Include(p => p.PlanesClases)
                .ThenInclude(pc => pc.Clase);
    }

    /// <summary>Proyección estándar de un plan a su DTO.</summary>
    internal static PlanDto MapearDto(Plan p)
    {
        return new PlanDto
        {
            Id = p.Id,
            Nombre = p.Nombre,
            Descripcion = p.Descripcion,

            Precio = p.Precio,

            Precio1Mes = p.Precio1Mes,
            Precio3Meses = p.Precio3Meses,
            Precio6Meses = p.Precio6Meses,
            Precio12Meses = p.Precio12Meses,

            Tipo = p.Tipo,
            Activo = p.Activo,

            Beneficios = p.PlanesBeneficios
                .Where(pb => pb.Beneficio != null)
                .Select(pb => new BeneficioDto
                {
                    Id = pb.Beneficio!.Id,
                    Nombre = pb.Beneficio.Nombre,
                    Descripcion = pb.Beneficio.Descripcion,
                    Activo = pb.Beneficio.Activo
                })
                .ToList(),

            Clases = p.PlanesClases
                .Where(pc => pc.Clase != null)
                .Select(pc => new ClaseDto
                {
                    Id = pc.Clase!.Id,
                    Nombre = pc.Clase.Nombre,
                    Descripcion = pc.Clase.Descripcion,
                    DuracionMinutos = pc.Clase.DuracionMinutos,
                    CapacidadMaxima = pc.Clase.CapacidadMaxima,
                    Activa = pc.Clase.Activa
                })
                .ToList()
        };
    }
}
