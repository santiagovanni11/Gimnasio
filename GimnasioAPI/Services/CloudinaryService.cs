namespace GimnasioAPI.Services;

/// <summary>
/// Sube imágenes (fotos de socios) a Cloudinary usando su API
/// HTTP multipart. Devuelve la URL pública permanente de la
/// imagen, lista para guardarse en FotoUrl del socio.
/// Las credenciales se leen de configuración (CLOUDINARY_*).
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
        !string.IsNullOrWhiteSpace(ApiKey) &&
        !string.IsNullOrWhiteSpace(ApiSecret);

    private string? CloudName => _config["CLOUDINARY_CLOUD_NAME"];
    private string? ApiKey => _config["CLOUDINARY_API_KEY"];
    private string? ApiSecret => _config["CLOUDINARY_API_SECRET"];

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
                "faltan CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET).");
        }

        var carpeta = "gimnasio/fotos";
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        var firma = FirmarCloudinary(
            $"cloud_name={CloudName}&folder={carpeta}&timestamp={timestamp}",
            ApiSecret!);

        using var form = new MultipartFormDataContent();

        var archivoContent = new StreamContent(contenido);
        form.Add(archivoContent, "file", nombreOriginal);

        form.Add(new StringContent(CloudName!), "cloud_name");
        form.Add(new StringContent(ApiKey!), "api_key");
        form.Add(new StringContent(timestamp.ToString()), "timestamp");
        form.Add(new StringContent(firma), "signature");
        form.Add(new StringContent(carpeta), "folder");
        form.Add(new StringContent("rw_auto"), "resource_type");

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

    /// <summary>
    /// Genera la firma SHA-1 que exige la API de Cloudinary.
    /// </summary>
    internal static string FirmarCloudinary(
        string paraFirmar,
        string apiSecret)
    {
        using var sha = System.Security.Cryptography.SHA1.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(
            paraFirmar + apiSecret);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
