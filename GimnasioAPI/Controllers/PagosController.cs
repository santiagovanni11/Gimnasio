using GimnasioAPI.Data;
using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de pagos (GET). Las mutaciones viven en la parte
/// Comandos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public partial class PagosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuditoriaUsuariosService _auditoria;

    public PagosController(
        AppDbContext context,
        AuditoriaUsuariosService auditoria)
    {
        _context = context;
        _auditoria = auditoria;
    }

    // GET: api/Pagos � Administrador y Recepcionista.
    [HttpGet]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<IEnumerable<PagoDto>>> GetPagos()
    {
        var pagos = await CargarConRelaciones().ToListAsync();
        return Ok(pagos.Select(MapearDto));
    }

    // GET: api/Pagos/5 � Administrador y Recepcionista.
    [HttpGet("{id}")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<ActionResult<PagoDto>> GetPago(int id)
    {
        var pago = await CargarConRelaciones()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (pago == null)
        {
            return NotFound();
        }

        return Ok(MapearDto(pago));
    }

    private IQueryable<Pago> CargarConRelaciones()
    {
        return _context.Pagos
            .Include(p => p.Membresia)
                .ThenInclude(m => m.Socio)
            .Include(p => p.Membresia)
                .ThenInclude(m => m.Plan);
    }

    /// <summary>Proyecci�n est�ndar de un pago a su DTO.</summary>
    internal static PagoDto MapearDto(Pago p)
    {
        return new PagoDto
        {
            Id = p.Id,

            MembresiaId = p.MembresiaId,
            PlanId = p.Membresia?.PlanId ?? 0,
            PlanNombre =
                p.Membresia?.Plan?.Nombre ?? string.Empty,

            SocioId = p.Membresia?.SocioId ?? 0,
            SocioNombre =
                p.Membresia?.Socio?.Nombre ?? string.Empty,
            SocioApellido =
                p.Membresia?.Socio?.Apellido ?? string.Empty,

            Monto = p.Monto,
            FormaPago = p.FormaPago,
            Estado = p.Estado,
            FechaPago = p.FechaPago,

            Referencia = p.Referencia,
            Observaciones = p.Observaciones,

            RegistradoPor = p.RegistradoPor,
            MotivoAnulacion = p.MotivoAnulacion,

            AnuladoPor = p.AnuladoPor,
            FechaAnulacion = p.FechaAnulacion
        };
    }
}
