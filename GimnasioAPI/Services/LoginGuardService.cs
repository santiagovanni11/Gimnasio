using GimnasioAPI.Data;
using GimnasioAPI.Models;

namespace GimnasioAPI.Services;

/// <summary>
/// Protección del login contra fuerza bruta: bloquea la
/// cuenta temporalmente tras N intentos fallidos seguidos y
/// registra el último acceso exitoso.
/// </summary>
public class LoginGuardService
{
    public const int MaxIntentosFallidos = 5;
    public const int MinutosBloqueo = 15;

    /// <summary>
    /// Mensaje si la cuenta está bloqueada; null en caso contrario.
    /// </summary>
    public string? ObtenerMensajeBloqueo(Usuario usuario)
    {
        if (usuario.BloqueadoHasta is DateTime hasta &&
            hasta > DateTime.UtcNow)
        {
            var minutos = Math.Ceiling(
                (hasta - DateTime.UtcNow).TotalMinutes);

            return
                "Cuenta bloqueada por intentos fallidos. " +
                $"Reintentá en {minutos} minuto(s).";
        }

        return null;
    }

    /// <summary>
    /// Registra un intento fallido y bloquea la cuenta al
    /// alcanzar el máximo permitido. Persiste los cambios.
    /// Devuelve true si con este intento quedó bloqueada.
    /// </summary>
    public async Task<bool> RegistrarFalloAsync(
        AppDbContext context,
        Usuario usuario)
    {
        usuario.IntentosFallidos++;

        if (usuario.IntentosFallidos < MaxIntentosFallidos)
        {
            await context.SaveChangesAsync();
            return false;
        }

        usuario.BloqueadoHasta =
            DateTime.UtcNow.AddMinutes(MinutosBloqueo);

        usuario.IntentosFallidos = 0;
        await context.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Marca el acceso exitoso y limpia los contadores.
    /// El caller persiste con SaveChanges.
    /// </summary>
    public void RegistrarAcceso(Usuario usuario)
    {
        usuario.UltimoAcceso = DateTime.UtcNow;
        usuario.IntentosFallidos = 0;
        usuario.BloqueadoHasta = null;
    }
}
