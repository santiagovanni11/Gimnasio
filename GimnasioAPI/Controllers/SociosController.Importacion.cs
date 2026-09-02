using GimnasioAPI.Data;
using GimnasioAPI.Models;
using GimnasioAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Importación masiva de socios. El frontend parsea el CSV y
/// envía un arreglo de Socio ya normalizado para su validación.
/// </summary>
public partial class SociosController
{
    // =========================================================
    // POST: api/Socios/importar
    // Solo Administrador y Recepcionista.
    // =========================================================

    [HttpPost("importar")]
    [Authorize(Roles = RolesGimnasio.Administracion)]
    public async Task<IActionResult> ImportarSocios(
        [FromBody] List<Socio> socios)
    {
        if (socios == null || socios.Count == 0)
        {
            return BadRequest("No se enviaron socios para importar.");
        }

        var errores = new List<object>();
        var dnisVistos = new HashSet<string>(
            StringComparer.OrdinalIgnoreCase);
        var validos = new List<Socio>();

        for (int i = 0; i < socios.Count; i++)
        {
            var socio = socios[i];
            var mensaje = SocioValidaciones.ValidarDatos(socio);

            if (mensaje != null)
            {
                errores.Add(new { fila = i + 2, motivo = mensaje });
                continue;
            }

            var dni = socio.DNI.Trim();

            if (dnisVistos.Contains(dni) || await DniEnUsoAsync(dni))
            {
                errores.Add(new { fila = i + 2, motivo = "DNI duplicado." });
                continue;
            }

            dnisVistos.Add(dni);
            NormalizarDatos(socio);
            socio.FechaAlta = DateTime.UtcNow;
            socio.Activo = true;
            validos.Add(socio);
        }

        if (validos.Count > 0)
        {
            _context.Socios.AddRange(validos);
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            importados = validos.Count,
            rechazados = errores.Count,
            errores
        });
    }
}
