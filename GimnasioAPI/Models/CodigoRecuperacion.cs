namespace GimnasioAPI.Models;

/// <summary>
/// Código de un solo uso para recuperar la contraseña. Se guarda
/// hasheado (BCrypt): un vuelco de la base no expone los códigos.
/// </summary>
public class CodigoRecuperacion
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    /// <summary>Hash BCrypt del código de 6 dígitos.</summary>
    public string CodigoHash { get; set; } = string.Empty;

    /// <summary>Momento UTC a partir del cual el código no vale.</summary>
    public DateTime ExpiraUtc { get; set; }

    /// <summary>Intentos de ingreso fallidos de este código.</summary>
    public int Intentos { get; set; }

    /// <summary>True cuando el código ya se consumió.</summary>
    public bool Usado { get; set; }

    public DateTime FechaCreacionUtc { get; set; } = DateTime.UtcNow;

    public Usuario? Usuario { get; set; }
}
