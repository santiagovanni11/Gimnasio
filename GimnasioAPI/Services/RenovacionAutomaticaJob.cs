namespace GimnasioAPI.Services;

public class RenovacionAutomaticaJob : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<RenovacionAutomaticaJob> _logger;

    public RenovacionAutomaticaJob(
        IServiceProvider services,
        ILogger<RenovacionAutomaticaJob> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var servicio = scope.ServiceProvider
                    .GetRequiredService<RenovacionAutomaticaService>();

                var procesadas = await servicio.ProcesarRenovacionesPendientes();

                if (procesadas > 0)
                    _logger.LogInformation(
                        "Renovaciones automáticas procesadas: {Count}", procesadas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en job de renovación automática");
            }

            await Task.Delay(TimeSpan.FromHours(24), ct);
        }
    }
}
