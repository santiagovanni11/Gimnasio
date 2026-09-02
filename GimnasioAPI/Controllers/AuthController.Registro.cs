using GimnasioAPI.DTOs;
using GimnasioAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GimnasioAPI.Controllers;

/// <summary>
/// Alta pública de cuentas con nombre, apellido y rol. La
/// creación (validaciones, hash y auditoría) vive en
/// CreacionUsuariosService; aquí solo aplica la política de
/// roles admitidos y da forma a la respuesta.
/// </summary>
public partial class AuthController
{
    // =========================================================
    // POST: api/Auth/registro
    // =========================================================

    [HttpPost("registro")]
    [AllowAnonymous]
    public async Task<IActionResult> RegistrarUsuario(
        CrearUsuarioDto dto)
    {
        var resultado = await _altas.CrearAsync(
            dto,
            politicaRol: ValidarPoliticaRegistro);

        if (resultado.Error != null)
        {
            return BadRequest(resultado.Error);
        }

        var usuario = resultado.Usuario!;
        var rol = resultado.Rol!;

        return Created(
            $"api/Usuarios/{usuario.Id}",
            new
            {
                usuario.Id,
                usuario.Email,
                usuario.Nombre,
                usuario.Apellido,
                usuario.RolId,
                RolNombre = rol.Nombre,
                usuario.Activo,
                usuario.FechaCreacion
            });
    }

    private static bool EsRolDeRegistroPermitido(
        string nombreRol) =>
        RolesGimnasio.RegistroPermitido.Contains(nombreRol);

    /// <summary>
    /// Política del registro público: solo roles operativos.
    /// </summary>
    private static string? ValidarPoliticaRegistro(Rol rol)
    {
        return EsRolDeRegistroPermitido(rol.Nombre)
            ? null
            : "El rol seleccionado no está permitido.";
    }
}
