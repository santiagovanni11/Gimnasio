// =========================================================
// USUARIOS — Sección (solo Administrador)
// El orden por rol y el filtro de inactivos viven en
// useUsuarios; la tabla, en TablaUsuarios; el historial de
// cambios, en AuditoriaUsuarioModal.
// =========================================================

import { useState } from "react";
import TablaUsuarios from "./TablaUsuarios";
import AuditoriaUsuarioModal from "./AuditoriaUsuarioModal";

function UsuariosSection({
  usuarios,
  usuariosFiltrados,
  roles,
  verInactivos,
  setVerInactivos,
  filtroRol,
  setFiltroRol,
  miUsuarioId,
  cargando,
  error,
  mensaje,
  alternarEstado,
  cambiarRol,
  resetearPassword,
  desbloquear,
  eliminarUsuario,
  auditoria,
  verAuditoria,
  cerrarAuditoria,
}) {
  const [busqueda, setBusqueda] = useState("");

  // Búsqueda sobre el listado ya filtrado por estado y ordenado
  const resultados = usuariosFiltrados.filter((usuario) => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return true;

    const nombreCompleto =
      `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`
        .toLowerCase()
        .trim();

    return (
      usuario.email.toLowerCase().includes(texto) ||
      usuario.rolNombre.toLowerCase().includes(texto) ||
      nombreCompleto.includes(texto)
    );
  });

  const hayOcultos =
    !busqueda && usuarios.length > 0 && resultados.length === 0;

  return (
    <section className="content-card">
      <div className="section-header">
        <div>
          <h2>Usuarios</h2>
          <p>Cuentas con acceso al sistema.</p>
        </div>

        <div className="section-actions">
          <div className="search-box">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, email o rol..."
            />
          </div>

          <select
            className="rol-select filtro-rol-select"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            <option value="">Todos los roles</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>

          <label
            className="quick-range-button"
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={verInactivos}
              onChange={(e) => setVerInactivos(e.target.checked)}
              style={{ marginRight: "6px" }}
            />
            Mostrar inactivos
          </label>
        </div>
      </div>

      {mensaje && (
        <div className="success-message">{mensaje}</div>
      )}

      {cargando && (
        <div className="info-message">Cargando usuarios...</div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!cargando && !error && usuarios.length === 0 && (
        <div className="empty-state">No hay usuarios registrados.</div>
      )}

      {!cargando && !error && hayOcultos && (
        <div className="empty-state">
          Solo se muestran los usuarios activos.
        </div>
      )}

      {!cargando && !error && resultados.length === 0 && busqueda.length > 0 && (
        <div className="empty-state">
          No se encontraron usuarios con esa búsqueda.
        </div>
      )}

      {!cargando && !error && resultados.length > 0 && (
        <TablaUsuarios
          usuarios={resultados}
          roles={roles}
          miUsuarioId={miUsuarioId}
          alternarEstado={alternarEstado}
          cambiarRol={cambiarRol}
          resetearPassword={resetearPassword}
          desbloquear={desbloquear}
          eliminarUsuario={eliminarUsuario}
          verAuditoria={verAuditoria}
        />
      )}

      <AuditoriaUsuarioModal
        auditoria={auditoria}
        onClose={cerrarAuditoria}
      />
    </section>
  );
}

export default UsuariosSection;
