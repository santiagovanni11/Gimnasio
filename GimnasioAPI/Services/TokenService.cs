using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GimnasioAPI.Models;
using GimnasioAPI.Settings;
using Microsoft.IdentityModel.Tokens;

namespace GimnasioAPI.Services;

/// <summary>
/// Generación de tokens JWT para sesiones autenticadas.
/// </summary>
public class TokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(IConfiguration configuration)
    {
        _jwtSettings = configuration
            .GetSection("Jwt")
            .Get<JwtSettings>()
            ?? throw new InvalidOperationException(
                "La configuración JWT no está disponible.");
    }

    public DateTime CalcularExpiracion()
    {
        return DateTime.UtcNow.AddMinutes(
            _jwtSettings.ExpirationMinutes);
    }

    /// <summary>Genera un JWT con los claims del usuario.</summary>
    public string GenerarToken(Usuario usuario)
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                usuario.Id.ToString()),

            new Claim(
                ClaimTypes.Email,
                usuario.Email),

            new Claim(
                ClaimTypes.Role,
                usuario.Rol?.Nombre ?? string.Empty)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: CalcularExpiracion(),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
