namespace GimnasioAPI.Services;

using System.Net.Http.Headers;
using System.Text;

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
    /// Construye el multipart manualmente (sin usar
    /// MultipartFormDataContent) para asegurar que todos los
    /// campos de texto lleguen correctamente a Cloudinary.
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

        var boundary = Guid.NewGuid().ToString("N");
        var lf = "\r\n";

        using var body = new MemoryStream();

        // Campos de texto: cloud_name y upload_preset
        EscribirCampoTexto(body, boundary, "cloud_name", CloudName!);
        EscribirCampoTexto(body, boundary, "upload_preset", UploadPreset!);

        // Campo de archivo
        EscribirEncabezadoArchivo(
            body, boundary, "file", nombreOriginal, "application/octet-stream");
        await contenido.CopyToAsync(body, ct);
        Escribir(body, lf);

        // Cierre del multipart
        Escribir(body, $"--{boundary}--{lf}");

        body.Position = 0;

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://api.cloudinary.com/v1_1/{CloudName}/image/upload");

        request.Content = new StreamContent(body);
        request.Content.Headers.ContentType =
            MediaTypeHeaderValue.Parse(
                $"multipart/form-data; boundary={boundary}");

        using var respuesta = await _http.SendAsync(request, ct);

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

    private static void EscribirCampoTexto(
        Stream cuerpo, string boundary, string nombre, string valor)
    {
        var bytes = Encoding.UTF8.GetBytes(
            $"--{boundary}\r\n" +
            $"Content-Disposition: form-data; name=\"{nombre}\"\r\n\r\n" +
            valor +
            "\r\n");
        cuerpo.Write(bytes, 0, bytes.Length);
    }

    private static void EscribirEncabezadoArchivo(
        Stream cuerpo, string boundary, string nombre,
        string nombreArchivo, string contentType)
    {
        var bytes = Encoding.UTF8.GetBytes(
            $"--{boundary}\r\n" +
            $"Content-Disposition: form-data; name=\"{nombre}\"; filename=\"{nombreArchivo}\"\r\n" +
            $"Content-Type: {contentType}\r\n\r\n");
        cuerpo.Write(bytes, 0, bytes.Length);
    }

    private static void Escribir(Stream cuerpo, string cadena)
    {
        var bytes = Encoding.UTF8.GetBytes(cadena);
        cuerpo.Write(bytes, 0, bytes.Length);
    }
}
