using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Extensions;

/// <summary>
/// Guardado con manejo uniforme de concurrencia optimista para
/// los PUT: si la entidad fue eliminada por otro usuario responde
/// NotFound; si sigue existiendo propaga el conflicto real.
/// </summary>
public static class GuardadoConConcurrencia
{
    /// <param name="entidadSigueExistiendo">
    /// Verificación post-conflicto (ej.: existe el registro).
    /// </param>
    /// <returns>NotFoundResult ante entidad inexistente; null si guardó bien.</returns>
    public static async Task<IActionResult?> GuardarAsync(
        this DbContext contexto,
        Func<Task<bool>> entidadSigueExistiendo)
    {
        try
        {
            await contexto.SaveChangesAsync();

            return null;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await entidadSigueExistiendo())
            {
                return new NotFoundResult();
            }

            throw;
        }
    }
}
