// =========================================================
// ACCIONES DE SOCIOS — Búsqueda, inactivos, alta y export
// =========================================================

function SociosAcciones({
  busqueda,
  setBusqueda,
  verInactivos,
  setVerInactivos,
  puedeCrear,
  abrirFormulario,
  exportar,
  hayDatos,
}) {
  return (
    <div className="section-actions">
      <div className="search-box">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, DNI o teléfono..."
        />
      </div>

      <label className="quick-range-button" style={{ cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={verInactivos}
          onChange={(e) => setVerInactivos(e.target.checked)}
          style={{ marginRight: "6px" }}
        />
        Mostrar inactivos
      </label>

      {puedeCrear && (
        <button
          type="button"
          className="primary-small-button"
          onClick={abrirFormulario}
        >
          + Nuevo socio
        </button>
      )}

      <button
        type="button"
        className="export-button"
        onClick={exportar}
        disabled={!hayDatos}
        title="Exportar listado a CSV"
      >
        Exportar CSV
      </button>
    </div>
  );
}

export default SociosAcciones;
