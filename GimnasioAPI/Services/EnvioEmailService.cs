using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace GimnasioAPI.Services;

/// <summary>
/// Envío de emails transaccionales vía SMTP (Brevo). La
/// configuración viene de variables de entorno: SMTP_HOST,
/// SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM y
/// SMTP_FROM_NOMBRE.
/// </summary>
public class EnvioEmailService
{
    private readonly IConfiguration _config;

    public EnvioEmailService(IConfiguration config)
    {
        _config = config;
    }

    /// <summary>
    /// Envía el código de recuperación. Lanza excepción si el
    /// envío falla; el caller decide cómo informarlo.
    /// </summary>
    public async Task EnviarCodigoRecuperacionAsync(
        string emailDestino, string codigo)
    {
        var mensaje = ArmarMensaje(emailDestino, codigo);

        // Las operaciones async de MailKit ignoran la propiedad
        // Timeout: el único tope real es un CancellationToken.
        using var corta = new CancellationTokenSource(
            TimeSpan.FromSeconds(20));

        using var cliente = new SmtpClient();

        await cliente.ConnectAsync(
            _config["SMTP_HOST"] ?? "smtp-relay.brevo.com",
            ParsearPuerto(),
            SecureSocketOptions.StartTls,
            corta.Token);

        try
        {
            await cliente.AuthenticateAsync(
                Requerido("SMTP_USER"),
                Requerido("SMTP_PASS"),
                corta.Token);

            await cliente.SendAsync(mensaje, corta.Token);
        }
        finally
        {
            await cliente.DisconnectAsync(true, corta.Token);
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

    private MimeMessage ArmarMensaje(
        string emailDestino, string codigo)
    {
        var nombre = _config["SMTP_FROM_NOMBRE"] ?? "Forza";

        var mensaje = new MimeMessage();
        mensaje.From.Add(new MailboxAddress(
            nombre, Requerido("SMTP_FROM")));
        mensaje.To.Add(MailboxAddress.Parse(emailDestino));
        mensaje.Subject = "Tu código para recuperar la contraseña";

        mensaje.Body = new BodyBuilder
        {
            HtmlBody = $"""
                <p>Hola,</p>
                <p>Tu código para restablecer la contraseña es:</p>
                <p style="font-size:28px;font-weight:bold;
                    letter-spacing:6px;">{codigo}</p>
                <p>Vence en 10 minutos. Si no fuiste vos,
                ignorá este mensaje.</p>
                <p style="color:#888;">{nombre} · No responder
                este correo.</p>
                """,
            TextBody = $"""
                Tu código para restablecer la contraseña es:
                {codigo}

                Vence en 10 minutos. Si no fuiste vos,
                ignorá este mensaje.

                {nombre} · No responder este correo.
                """,
        }.ToMessageBody();

        return mensaje;
    }

    private int ParsearPuerto() =>
        int.TryParse(_config["SMTP_PORT"], out var puerto)
            ? puerto
            : 587;
}
