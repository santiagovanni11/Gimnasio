namespace GimnasioAPI.Services;

/// <summary>
/// Sube imágenes (fotos de socios) a Cloudinary usando un
/// "unsigned upload preset". No requiere generar firma; el
/// preset se crea en Cloudinary con Signing Mode = Unsigned.
/// Las credenciales y el nombre del preset se leen de
/// configuración (CLOUDINARY_*).
/// </summary>
public class CloudinaryService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    public CloudinaryService(
        HttpClient http,
        IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    public bool Configurado =>
        !string.IsNullOrWhiteSpace(CloudName) &&
        !string.IsNullOrWhiteSpace(UploadPreset);

    private string? CloudName => _config["CLOUDINARY_CLOUD_NAME"];
    private string? UploadPreset => _config["CLOUDINARY_UPLOAD_PRESET"];

    /// <summary>
    /// Sube un archivo a Cloudinary y devuelve la URL pública.
    /// Lanza una excepción si algo falla.
    /// </summary>
    public async Task<string> SubirFotoAsync(
        Stream contenido,
        string nombreOriginal,
        CancellationToken ct = default)
    {
        if (!Configurado)
        {
            throw new InvalidOperationException(
                "Cloudinary no está configurado (" +
                "faltan CLOUDINARY_CLOUD_NAME / CLOUDINARY_UPLOAD_PRESET).");
        }

        using var form = new MultipartFormDataContent();

        var archivoContent = new StreamContent(contenido);
        form.Add(archivoContent, "file", nombreOriginal);

        form.Add(new StringContent(CloudName!), "cloud_name");
        form.Add(new StringContent(UploadPreset!), "upload_preset");

        var endpoint =
            $"https://api.cloudinary.com/v1_1/{CloudName}/image/upload";

        using var respuesta =
            await _http.PostAsync(endpoint, form, ct);

        var cuerpo = await respuesta.Content.ReadAsStringAsync(ct);

        if (!respuesta.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"Cloudinary rechazó la subida ({respuesta.StatusCode}): {cuerpo}");
        }

        using var json = System.Text.Json.JsonDocument.Parse(cuerpo);
        var url = json.RootElement.TryGetProperty("secure_url", out var seguro)
            ? seguro.GetString()
            : null;

        return url
            ?? throw new InvalidOperationException(
                "Cloudinary no devolvió una URL.");
    }
}
