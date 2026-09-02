// =========================================================
// FILTROS DE USUARIOS
// Búsqueda por texto, filtro de rol, visibilidad de inactivos
// y acceso al alta de cuentas. Encabezado de la sección.
// =========================================================

import BotonesExportarUsuarios from "./BotonesExportarUsuarios";

function FiltrosUsuarios({
  busqueda,
  setBusqueda,
  filtroRol,
  setFiltroRol,
  verInactivos,
  setVerInactivos,
  roles,
  usuarios,
  ordenUsuarios,
  setOrdenUsuarios,
  abrirAltaUsuario,
}) {
  return (
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

        <select
          className="rol-select filtro-rol-select"
          value={ordenUsuarios}
          onChange={(e) => setOrdenUsuarios(e.target.value)}
        >
          <option value="nombre_asc">Nombre (A-Z)</option>
          <option value="nombre_desc">Nombre (Z-A)</option>
          <option value="alta_desc">Alta reciente</option>
          <option value="acceso_desc">Último acceso</option>
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

      <button
        type="button"
        className="primary-small-button"
        onClick={abrirAltaUsuario}
      >
        + Nuevo usuario
      </button>

      <BotonesExportarUsuarios usuarios={usuarios} />
    </div>
  );
}

export default FiltrosUsuarios;
