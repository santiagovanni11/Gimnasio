// =========================================================
// TOPBAR — Encabezado de la vista actual
// =========================================================

const TITULOS = {
  inicio: { titulo: "Dashboard", sub: "Resumen general del gimnasio" },
  socios: { titulo: "Socios", sub: "Personas registradas y su estado" },
  membresias: { titulo: "Membresías", sub: "Planes y vigencia de cada socio" },
  pagos: { titulo: "Pagos", sub: "Cobros, caja y morosos" },
  precios: { titulo: "Planes y precios", sub: "Configuración de planes y beneficios" },
  usuarios: { titulo: "Usuarios", sub: "Accesos y roles del equipo" },
  clases: { titulo: "Clases", sub: "Catálogo y horarios" },
  asistencias: { titulo: "Asistencias", sub: "Registro diario de ingreso" },
};

function Topbar({ seccion, rol, onAbrirMiCuenta }) {
  const info = TITULOS[seccion] ?? { titulo: "Gimnasio", sub: "Administración" };

  return (
    <header className="topbar">
      <div className="titulo">
        <h1>{info.titulo}</h1>
        <p>{info.sub}</p>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onAbrirMiCuenta}
          title="Cambiar contraseña"
        >
          Cambiar contraseña
        </button>

        <div className="role-badge">{rol}</div>
      </div>
    </header>
  );
}

export default Topbar;
