using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GimnasioAPI.Data.Configurations;

// =========================================================
// CONFIGURACIÓN DE ENTIDADES OPERATIVAS
// Horarios, inscripciones, asistencias, membresías, pagos y
// auditoría de cuentas.
// =========================================================

public class HorarioClaseConfig : IEntityTypeConfiguration<HorarioClase>
{
    public void Configure(EntityTypeBuilder<HorarioClase> b)
    {
        b.Property(h => h.Id).ValueGeneratedOnAdd();

        b.HasOne(h => h.Clase)
            .WithMany(c => c.Horarios)
            .HasForeignKey(h => h.ClaseId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(h => h.Empleado)
            .WithMany(e => e.Horarios)
            .HasForeignKey(h => h.EmpleadoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class InscripcionClaseConfig : IEntityTypeConfiguration<InscripcionClase>
{
    public void Configure(EntityTypeBuilder<InscripcionClase> b)
    {
        b.Property(i => i.Id).ValueGeneratedOnAdd();

        b.HasOne(i => i.Socio)
            .WithMany()
            .HasForeignKey(i => i.SocioId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(i => i.HorarioClase)
            .WithMany(h => h.Inscripciones)
            .HasForeignKey(i => i.HorarioClaseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class AsistenciaConfig : IEntityTypeConfiguration<Asistencia>
{
    public void Configure(EntityTypeBuilder<Asistencia> b)
    {
        b.Property(a => a.Id).ValueGeneratedOnAdd();

        b.Property(a => a.Motivo).HasMaxLength(20);
        b.Property(a => a.DetalleMotivo).HasMaxLength(300);
        b.Property(a => a.RegistradoPor).HasMaxLength(256);

        b.HasOne(a => a.Socio)
            .WithMany()
            .HasForeignKey(a => a.SocioId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(a => a.InscripcionClase)
            .WithMany()
            .HasForeignKey(a => a.InscripcionClaseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class MembresiaConfig : IEntityTypeConfiguration<Membresia>
{
    public void Configure(EntityTypeBuilder<Membresia> b)
    {
        b.Property(m => m.Id).ValueGeneratedOnAdd();
        b.Property(m => m.PrecioAplicado).HasPrecision(18, 2);
    }
}

public class PagoConfig : IEntityTypeConfiguration<Pago>
{
    public void Configure(EntityTypeBuilder<Pago> b)
    {
        b.Property(p => p.Id).ValueGeneratedOnAdd();
        b.Property(p => p.Monto).HasPrecision(18, 2);
    }
}

public class AuditoriaUsuarioConfig
    : IEntityTypeConfiguration<AuditoriaUsuario>
{
    public void Configure(
        EntityTypeBuilder<AuditoriaUsuario> b)
    {
        b.Property(a => a.Id).ValueGeneratedOnAdd();

        b.Property(a => a.Accion).HasMaxLength(30);
        b.Property(a => a.EmailUsuario).HasMaxLength(256);
        b.Property(a => a.RealizadoPorEmail).HasMaxLength(256);
        b.Property(a => a.Detalle).HasMaxLength(300);

        // Sin FK: los registros sobreviven al borrado físico
        // de usuarios (snapshot de emails).
        b.HasIndex(a => new { a.UsuarioId, a.FechaUtc });
    }
}

public class HistorialPrecioPlanConfig
    : IEntityTypeConfiguration<HistorialPrecioPlan>
{
    public void Configure(EntityTypeBuilder<HistorialPrecioPlan> b)
    {
        b.Property(h => h.Id).ValueGeneratedOnAdd();

        b.Property(h => h.Usuario).HasMaxLength(256);
        b.Property(h => h.Estado).HasMaxLength(20);

        b.Property(h => h.Precio1Mes).HasPrecision(18, 2);
        b.Property(h => h.Precio3Meses).HasPrecision(18, 2);
        b.Property(h => h.Precio6Meses).HasPrecision(18, 2);
        b.Property(h => h.Precio12Meses).HasPrecision(18, 2);

        b.HasOne(h => h.Plan)
            .WithMany()
            .HasForeignKey(h => h.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(h => new { h.PlanId, h.FechaUtc });
    }
}
