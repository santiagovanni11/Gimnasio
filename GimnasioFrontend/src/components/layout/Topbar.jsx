// =========================================================
// TOPBAR — Encabezado de la vista actual
// Incluye el acceso a "cambiar mi contraseña".
// =========================================================

const TITULOS = {
  inicio: "Dashboard",
  socios: "Socios",
  membresias: "Membresías",
  pagos: "Pagos",
  precios: "Configuración de precios",
  usuarios: "Usuarios",
};

function Topbar({ seccion, rol, onAbrirMiCuenta }) {
  return (
    <header className="topbar">
      <div>
        <h1>{TITULOS[seccion] ?? "Gimnasio"}</h1>
        <p>Administración general del gimnasio</p>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onAbrirMiCuenta}
          title="Cambiar mi contraseña"
        >
          Cambiar contraseña
        </button>

        <div className="role-badge">{rol}</div>
      </div>
    </header>
  );
}

export default Topbar;
