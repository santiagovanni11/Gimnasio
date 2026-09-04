using System.Text;
using System.Text.Json;

namespace GimnasioAPI.Services;

/// <summary>
/// Envío de emails transaccionales vía la API HTTPS de Brevo
/// (puerto 443): a diferencia del SMTP, no depende de puertos
/// que los hostings gratuitos suelen bloquear. Usa la misma
/// clave en SMTP_PASS (es a la vez clave SMTP y de API) y las
/// variables SMTP_FROM y SMTP_FROM_NOMBRE.
/// </summary>
public class EnvioEmailService
{
    private const string UrlApi = "https://api.brevo.com/v3/smtp/email";

    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _http;

    public EnvioEmailService(
        IConfiguration config,
        IHttpClientFactory http)
    {
        _config = config;
        _http = http;
    }

    /// <summary>
    /// Envía el código de recuperación. Lanza excepción si el
    /// envío falla; el caller decide cómo informarlo.
    /// </summary>
    public async Task EnviarCodigoRecuperacionAsync(
        string emailDestino, string codigo)
    {
        var nombre = _config["SMTP_FROM_NOMBRE"] ?? "Forza";

        var cuerpo = new
        {
            sender = new
            {
                name = nombre,
                email = Requerido("SMTP_FROM")
            },
            to = new[] { new { email = emailDestino } },
            subject = "Tu código para recuperar la contraseña",
            htmlContent = $"""
                <p>Hola,</p>
                <p>Tu código para restablecer la contraseña es:</p>
                <p style="font-size:28px;font-weight:bold;
                    letter-spacing:6px;">{codigo}</p>
                <p>Vence en 10 minutos. Si no fuiste vos,
                ignorá este mensaje.</p>
                <p style="color:#888;">{nombre} · No responder
                este correo.</p>
                """,
            textContent = $"""
                Tu código para restablecer la contraseña es:
                {codigo}

                Vence en 10 minutos. Si no fuiste vos,
                ignorá este mensaje.

                {nombre} · No responder este correo.
                """,
        };

        var pedido = new HttpRequestMessage(
            HttpMethod.Post, UrlApi)
        {
            Content = new StringContent(
                JsonSerializer.Serialize(cuerpo),
                Encoding.UTF8,
                "application/json"),
        };

        pedido.Headers.Add("api-key", Requerido("SMTP_PASS"));

        using var corta = new CancellationTokenSource(
            TimeSpan.FromSeconds(20));

        var respuesta = await _http.CreateClient()
            .SendAsync(pedido, corta.Token);

        var detalle = await respuesta.Content
            .ReadAsStringAsync(corta.Token);

        if (!respuesta.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"Brevo rechazó el envío " +
                $"({(int)respuesta.StatusCode}): {detalle}");
        }
    }

    /// <summary>
    /// Lee una variable obligatoria; falla con mensaje claro si
    /// no está configurada (fallo temprano mejor que email roto).
    /// </summary>
    private string Requerido(string clave) =>
        _config[clave]
        ?? throw new InvalidOperationException(
            $"Falta la variable de entorno {clave}.");
}
