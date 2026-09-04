using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GimnasioAPI.Data;

/// <summary>
/// Contexto de datos de la aplicación. La configuración de
/// entidades vive en Data/Configurations (patrón
/// IEntityTypeConfiguration) y se aplica por reflexión.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Rol> Roles { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Empleado> Empleados { get; set; }
    public DbSet<Socio> Socios { get; set; }
    public DbSet<Plan> Planes { get; set; }
    public DbSet<Beneficio> Beneficios { get; set; }
    public DbSet<PlanBeneficio> PlanesBeneficios { get; set; }
    public DbSet<Clase> Clases { get; set; }
    public DbSet<PlanClase> PlanesClases { get; set; }
    public DbSet<HorarioClase> HorariosClases { get; set; }
    public DbSet<InscripcionClase> InscripcionesClases { get; set; }
    public DbSet<Membresia> Membresias { get; set; }
    public DbSet<Pago> Pagos { get; set; }
    public DbSet<Asistencia> Asistencias { get; set; }
    public DbSet<MetodoPagoAlmacenado> MetodosPagoAlmacenados { get; set; }

    public DbSet<AuditoriaUsuario> AuditoriaUsuarios { get; set; }

    public DbSet<CodigoRecuperacion> CodigosRecuperacion { get; set; }

    public DbSet<AuditoriaMembresia> AuditoriaMembresias { get; set; }

    public DbSet<AuditoriaPlan> AuditoriaPlanes { get; set; }

    public DbSet<HistorialPrecioPlan> HistorialPreciosPlanes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);
    }
}
