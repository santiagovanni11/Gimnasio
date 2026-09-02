using GimnasioAPI.Data;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Profesores disponibles para los horarios de clases: los
/// usuarios activos con rol Profesor. Al consultarlos se les
/// crea su legajo de empleado si aún no existe, garantizando
/// que HorarioClase siempre apunte a un Empleado real.
/// </summary>
public partial class EmpleadosController
{
    // GET: api/Empleados/profesores
    [HttpGet("profesores")]
    [Authorize(Roles = RolesGimnasio.TodosLosRoles)]
    public async Task<IActionResult> GetProfesores()
    {
        var rolProfesorId = await _context.Roles
            .Where(r => r.Nombre == RolesGimnasio.Profesor &&
                        r.Activo)
            .Select(r => (int?)r.Id)
            .FirstOrDefaultAsync();

        if (rolProfesorId == null)
        {
            return Ok(Array.Empty<object>());
        }

        var usuarios = await _context.Usuarios
            .Where(u => u.RolId == rolProfesorId && u.Activo)
            .OrderBy(u => u.Apellido)
            .ThenBy(u => u.Nombre)
            .ToListAsync();

        var resultado = new List<object>();

        foreach (var usuario in usuarios)
        {
            var legajo = await ObtenerOCrearLegajoAsync(
                usuario);

            resultado.Add(new
            {
                empleadoId = legajo.Id,
                usuario.Id,
                usuario.Nombre,
                usuario.Apellido,
                usuario.Email
            });
        }

        return Ok(resultado);
    }

    /// <summary>
    /// Legajo 1–1 del usuario profesor. El DNI es sintético
    /// ("USR-{id}") porque la columna tiene índice único y el
    /// alta de usuario no lo provee.
    /// </summary>
    private async Task<Empleado> ObtenerOCrearLegajoAsync(
        Usuario usuario)
    {
        var existente = await _context.Empleados
            .FirstOrDefaultAsync(e => e.UsuarioId == usuario.Id);

        if (existente != null)
        {
            return existente;
        }

        var legajo = new Empleado
        {
            Nombre = usuario.Nombre ?? string.Empty,
            Apellido = usuario.Apellido ?? string.Empty,
            Email = usuario.Email,
            DNI = $"USR-{usuario.Id}",
            TipoEmpleado = RolesGimnasio.Profesor,
            Activo = true,
            UsuarioId = usuario.Id
        };

        _context.Empleados.Add(legajo);
        await _context.SaveChangesAsync();

        return legajo;
    }
}
