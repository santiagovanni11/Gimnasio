using GimnasioAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Desbloqueo manual de cuentas bloqueadas por intentos
/// fallidos de login.
/// </summary>
public partial class UsuariosController
{
    // =========================================================
    // PUT: api/Usuarios/5/desbloqueo
    //
    // Limpia el bloqueo temporal y los intentos fallidos,
    // permitiendo el acceso sin esperar la expiración automática.
    // =========================================================

    [HttpPut("{id:int}/desbloqueo")]
    public async Task<IActionResult> DesbloquearUsuario(
        int id)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        if (usuario.BloqueadoHasta == null)
        {
            return BadRequest("La cuenta no está bloqueada.");
        }

        usuario.BloqueadoHasta = null;
        usuario.IntentosFallidos = 0;

        await _context.SaveChangesAsync();

        await _auditoria.RegistrarAsync(
            _context, AccionesAuditoriaUsuario.Desbloqueo,
            usuario);

        return NoContent();
    }
}
