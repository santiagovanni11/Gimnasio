using System.Text;
using GimnasioAPI.Data;
using GimnasioAPI.Extensions;
using GimnasioAPI.Services;
using GimnasioAPI.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Temporal: comportamiento heredado de fechas para migrar de SQL Server a
// PostgreSQL. Sin esto, Npgsql exige DateTime en UTC y el código usa
// DateTime.Today/Now (Kind=Unspecified), lo que rompe consultas como las del
// servicio de renovación automática.
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Desactiva la recarga en caliente de appsettings (reloadOnChange).
// En entornos con límite de inotify (p. ej. Render Free) el
// FileSystemWatcher de configuración supera el límite y aborta el
// arranque. Como en producción la configuración viene de variables
// de entorno, la recarga no aporta nada.
Environment.SetEnvironmentVariable(
    "DOTNET_hostBuilder__reloadConfigOnChange", "false");

var builder = WebApplication.CreateBuilder(args);

// OpenAPI
builder.Services.AddOpenApi();

// Servicios de negocio
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<AdministradorGuardService>();
builder.Services.AddScoped<ReglasMembresia>();
builder.Services.AddScoped<LoginGuardService>();
builder.Services.AddScoped<AuditoriaUsuariosService>();
builder.Services.AddScoped<AuditoriaMembresiasService>();
builder.Services.AddScoped<AuditoriaPlanesService>();
builder.Services.AddScoped<CreacionUsuariosService>();
builder.Services.AddScoped<EnvioEmailService>();
builder.Services.AddScoped<RenovacionAutomaticaService>();
builder.Services.AddHostedService<RenovacionAutomaticaJob>();
builder.Services.AddSingleton<TokenService>();

// Limitador de tasa para Auth (fuerza bruta por IP)
builder.Services.AgregarLimitadorAuth();

// Base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración JWT
var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "La configuración JWT no está disponible.");

// Autenticación JWT
builder.Services.AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings.Key))
            };
    });

// Autorización
builder.Services.AddAuthorization();

// CORS: solo orígenes permitidos por configuración
var allowedOriginsCsv = builder.Configuration["ALLOWED_ORIGINS"];
var allowedOrigins = allowedOriginsCsv is not null
    ? allowedOriginsCsv
        .Split(',', StringSplitOptions.RemoveEmptyEntries)
        .Select(o => o.Trim())
        .ToArray()
    : builder.Configuration
        .GetSection("AllowedOrigins")
        .Get<string[]>()
        ?? new[] { "http://localhost:5173", "http://127.0.0.1:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

var app = builder.Build();

// Aplica migraciones y crea los roles base en el arranque.
using (var scope = app.Services.CreateScope())
{
    await InicializacionBaseDatos.InicializarAsync(
        scope,
        app.Configuration,
        app.Logger);
}

// OpenAPI solamente en desarrollo
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Middleware
app.UseHttpsRedirection();

// Archivos estáticos (uploads/fotos, etc.)
app.UseStaticFiles();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

app.Run();

