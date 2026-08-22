using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Consulta de la auditoría de una cuenta de usuario.
/// </summary>
public partial class UsuariosController
{
    // =========================================================
    // GET: api/Usuarios/5/auditoria
    //
    // Últimos 50 movimientos registrados para la cuenta:
    // creación, cambios de rol/estado, resets y eliminaciones.
    // Los emails son snapshots; sobreviven al borrado físico.
    // =========================================================

    [HttpGet("{id:int}/auditoria")]
    public async Task<IActionResult> GetAuditoriaUsuario(
        int id)
    {
        var existe = await _context.Usuarios
            .AnyAsync(u => u.Id == id);

        if (!existe)
        {
            return NotFound("El usuario no existe.");
        }

        var registros = await _context.AuditoriaUsuarios
            .Where(a => a.UsuarioId == id)
            .OrderByDescending(a => a.FechaUtc)
            .Take(50)
            .Select(a => new
            {
                a.Id,
                a.Accion,
                a.Detalle,
                a.RealizadoPorEmail,
                a.FechaUtc
            })
            .ToListAsync();

        return Ok(registros);
    }
}
