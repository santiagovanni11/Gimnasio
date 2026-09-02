// =========================================================
// TARJETAS RESUMEN DE USUARIOS
// Estado del equipo en un vistazo: total, activos, inactivos
// y administradores. Reusa payment-summary-grid.
// =========================================================

function TarjetasResumenUsuarios({ usuarios = [] }) {
  const total = usuarios.length;
  const activos = usuarios.filter((u) => u.activo !== false).length;
  const inactivos = total - activos;
  const admins = usuarios.filter((u) =>
    (u.rolNombre ?? "").toLowerCase().includes("admin")
  ).length;

  const tarjetas = [
    { clase: "accent", titulo: "Usuarios", valor: total, nota: "En el sistema" },
    { clase: "active", titulo: "Activos", valor: activos, nota: "Con acceso" },
    { clase: "inactive", titulo: "Inactivos", valor: inactivos, nota: "Cuentas pausadas" },
    { clase: "warning", titulo: "Admins", valor: admins, nota: "Rol administrador" },
  ];

  return (
    <section className="payment-summary-grid">
      {tarjetas.map((t) => (
        <div key={t.titulo} className={`payment-summary-card ${t.clase}`}>
          <span>{t.titulo}</span>
          <strong>{t.valor}</strong>
          <small>{t.nota}</small>
        </div>
      ))}
    </section>
  );
}

export default TarjetasResumenUsuarios;
