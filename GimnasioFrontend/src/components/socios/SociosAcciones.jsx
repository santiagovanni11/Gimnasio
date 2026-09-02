// =========================================================
// ACCIONES DE SOCIOS — Búsqueda, inactivos, alta y export
// =========================================================

function SociosAcciones({
  busqueda,
  setBusqueda,
  mostrarTodos,
  setMostrarTodos,
  puedeCrear,
  abrirFormulario,
  exportar,
  hayDatos,
  abrirImportar,
  seleccionados = [],
  onToggleTodo,
  onBajaMasiva,
  onExportarSeleccionados,
}) {
  const tieneSeleccion = seleccionados.length > 0;

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
          checked={mostrarTodos}
          onChange={(e) => setMostrarTodos(e.target.checked)}
          style={{ marginRight: "6px" }}
        />
        Mostrar todos los socios
      </label>

      {hayDatos && (
        <button type="button" className="export-button" onClick={onToggleTodo}>
          {tieneSeleccion ? "Deseleccionar" : "Seleccionar todos"}
        </button>
      )}

      {puedeCrear && (
        <button
          type="button"
          className="primary-small-button"
          onClick={abrirFormulario}
        >
          + Nuevo socio
        </button>
      )}

      {tieneSeleccion && (
        <button type="button" className="cancel-button" onClick={onBajaMasiva}>
          Desactivar ({seleccionados.length})
        </button>
      )}

      {tieneSeleccion && (
        <button type="button" className="export-button" onClick={onExportarSeleccionados}>
          Exportar ({seleccionados.length})
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

      {puedeCrear && (
        <button
          type="button"
          className="export-button"
          onClick={abrirImportar}
          title="Importar socios desde un CSV"
        >
          Importar CSV
        </button>
      )}
    </div>
  );
}

export default SociosAcciones;
