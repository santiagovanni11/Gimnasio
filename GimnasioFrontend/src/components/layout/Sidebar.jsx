// =========================================================
// SIDEBAR — Navegación lateral del panel
// =========================================================

function Sidebar({
  rol,
  seccion,
  cambiarSeccion,
  permisos,
  setMensaje,
  cerrarSesion,
}) {
  const boton = (id, icono, texto, visible = true) =>
    !visible ? null : (
      <button
        type="button"
        className={seccion === id ? "nav-button active" : "nav-button"}
        onClick={() => cambiarSeccion(id)}
      >
        <span>{icono}</span>
        {texto}
      </button>
    );

  const botonPendiente = (icono, texto, mensaje) => (
    <button
      type="button"
      className="nav-button"
      onClick={() => setMensaje(mensaje)}
    >
      <span>{icono}</span>
      {texto}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">GYM</div>

        <div>
          <strong>Gimnasio</strong>
          <span>Administración</span>
        </div>
      </div>

      <div className="user-box">
        <div className="avatar">{rol.charAt(0).toUpperCase()}</div>

        <div>
          <strong>{rol}</strong>
          <span>Usuario activo</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {boton("inicio", "⌂", "Inicio")}

        {boton("socios", "◉", "Socios", permisos.puedeVerSocios)}

        {boton(
          "membresias",
          "▣",
          "Membresías",
          permisos.puedeVerMembresias
        )}

        {boton(
          "precios",
          "⚙",
          "Configuración de precios",
          rol === "Administrador"
        )}

        {boton("usuarios", "☰", "Usuarios", rol === "Administrador")}

        {boton("pagos", "◫", "Pagos", permisos.puedeVerPagos)}

        {permisos.puedeVerClases &&
          botonPendiente(
            "◌",
            "Clases",
            "Este módulo lo construiremos a continuación."
          )}

        {permisos.puedeVerAsistencias &&
          botonPendiente(
            "◈",
            "Asistencias",
            "Este módulo lo construiremos a continuación."
          )}
      </nav>

      <button type="button" className="logout-button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;
