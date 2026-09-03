namespace GimnasioAPI.Settings;

public class JwtSettings
{
    // Valores por defecto coherentes para que el token generado y
    // el validado coincidan aunque no exista appsettings.json
    // (p. ej. dentro del contenedor de Render, donde ese archivo
    // local no se copia). Los del appsettings.json o variables de
    // entorno Jwt__* los sobreescriben si se definen.
    public string Key { get; set; } =
        "ClaveDeDesarrolloPorDefecto_Gimnasio2026_NoUsarEnProduccion_987654321";

    public string Issuer { get; set; } = "GimnasioAPI";

    public string Audience { get; set; } = "GimnasioApp";

    public int ExpirationMinutes { get; set; } = 60;
}
