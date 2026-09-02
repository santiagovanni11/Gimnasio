using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GimnasioAPI.Data.Configurations;

// =========================================================
// CONFIGURACIÓN DE ENTIDADES NÚCLEO
// Roles, usuarios, empleados, socios, planes, beneficios y
// sus relaciones many-to-many.
//
// Nota sobre IDs: SQL Server los genera automáticamente
// (columnas IDENTITY); se declara ValueGeneratedOnAdd.
// =========================================================

public class RolConfig : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> b)
    {
        b.Property(r => r.Id).ValueGeneratedOnAdd();
        b.HasIndex(r => r.Nombre).IsUnique();
    }
}

public class UsuarioConfig : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> b)
    {
        b.Property(u => u.Id).ValueGeneratedOnAdd();

        b.Property(u => u.Email).HasMaxLength(256);
        b.Property(u => u.Nombre).HasMaxLength(120);
        b.Property(u => u.Apellido).HasMaxLength(120);

        b.HasOne(u => u.Rol)
            .WithMany(r => r.Usuarios)
            .HasForeignKey(u => u.RolId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasIndex(u => u.Email).IsUnique();
    }
}

public class EmpleadoConfig : IEntityTypeConfiguration<Empleado>
{
    public void Configure(EntityTypeBuilder<Empleado> b)
    {
        b.Property(e => e.Id).ValueGeneratedOnAdd();

        b.HasOne(e => e.Usuario)
            .WithOne()
            .HasForeignKey<Empleado>(e => e.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        b.HasIndex(e => e.UsuarioId)
            .IsUnique()
            .HasFilter("\"UsuarioId\" IS NOT NULL");

        b.HasIndex(e => e.DNI).IsUnique();
    }
}

public class SocioConfig : IEntityTypeConfiguration<Socio>
{
    public void Configure(EntityTypeBuilder<Socio> b)
    {
        b.Property(s => s.Id).ValueGeneratedOnAdd();
    }
}

public class PlanConfig : IEntityTypeConfiguration<Plan>
{
    public void Configure(EntityTypeBuilder<Plan> b)
    {
        b.Property(p => p.Id).ValueGeneratedOnAdd();

        b.Property(p => p.Precio).HasPrecision(18, 2);
        b.Property(p => p.Precio1Mes).HasPrecision(18, 2);
        b.Property(p => p.Precio3Meses).HasPrecision(18, 2);
        b.Property(p => p.Precio6Meses).HasPrecision(18, 2);
        b.Property(p => p.Precio12Meses).HasPrecision(18, 2);
    }
}

public class BeneficioConfig : IEntityTypeConfiguration<Beneficio>
{
    public void Configure(EntityTypeBuilder<Beneficio> b)
    {
        b.Property(bn => bn.Id).ValueGeneratedOnAdd();
        b.HasIndex(bn => bn.Nombre).IsUnique();
    }
}

public class PlanBeneficioConfig : IEntityTypeConfiguration<PlanBeneficio>
{
    public void Configure(EntityTypeBuilder<PlanBeneficio> b)
    {
        b.Property(pb => pb.Id).ValueGeneratedOnAdd();

        b.HasOne(pb => pb.Plan)
            .WithMany(p => p.PlanesBeneficios)
            .HasForeignKey(pb => pb.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(pb => pb.Beneficio)
            .WithMany(bn => bn.PlanesBeneficios)
            .HasForeignKey(pb => pb.BeneficioId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(pb => new { pb.PlanId, pb.BeneficioId })
            .IsUnique();
    }
}

public class PlanClaseConfig : IEntityTypeConfiguration<PlanClase>
{
    public void Configure(EntityTypeBuilder<PlanClase> b)
    {
        b.Property(pc => pc.Id).ValueGeneratedOnAdd();

        b.HasOne(pc => pc.Plan)
            .WithMany(p => p.PlanesClases)
            .HasForeignKey(pc => pc.PlanId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(pc => pc.Clase)
            .WithMany(c => c.PlanesClases)
            .HasForeignKey(pc => pc.ClaseId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(pc => new { pc.PlanId, pc.ClaseId })
            .IsUnique();
    }
}
