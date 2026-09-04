using GimnasioAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GimnasioAPI.Data.Configurations;

// =========================================================
// CONFIGURACIÓN DE ENTIDADES DE SEGURIDAD
// Recuperación de contraseña.
// =========================================================

public class CodigoRecuperacionConfig
    : IEntityTypeConfiguration<CodigoRecuperacion>
{
    public void Configure(
        EntityTypeBuilder<CodigoRecuperacion> b)
    {
        b.Property(c => c.Id).ValueGeneratedOnAdd();

        b.Property(c => c.CodigoHash).HasMaxLength(100);

        b.HasIndex(c => new { c.UsuarioId, c.Usado });

        b.HasOne(c => c.Usuario)
            .WithMany()
            .HasForeignKey(c => c.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
