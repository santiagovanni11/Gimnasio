// =========================================================
// FILTROS DE PRECIOS
// Buscador por nombre y selector de estado (todos/activos/
// pausados). La lógica de filtrado vive en useFiltrosPrecios.
// =========================================================

function FiltrosPrecios({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
}) {
  return (
    <div className="section-actions">
      <input
        type="search"
        className="filter-input"
        placeholder="Buscar plan..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <select
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        className="filter-select"
      >
        <option value="todos">Todos</option>
        <option value="activos">Activos</option>
        <option value="pausados">Pausados</option>
      </select>
    </div>
  );
}

export default FiltrosPrecios;
