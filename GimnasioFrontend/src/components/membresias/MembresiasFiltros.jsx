// =========================================================
// FILTROS DE MEMBRESÍAS — Búsqueda, estado y vencimiento
// =========================================================

function MembresiasFiltros({
  busquedaMembresia,
  setBusquedaMembresia,
  filtroEstado,
  setFiltroEstado,
  filtroVencimiento,
  setFiltroVencimiento,
  filtroPlan,
  setFiltroPlan,
  planes = [],
}) {
  return (
    <div className="section-actions" style={{ marginBottom: "1rem" }}>
      <div className="search-box">
        <input
          type="text"
          value={busquedaMembresia}
          onChange={(e) => setBusquedaMembresia(e.target.value)}
          placeholder="Buscar por nombre o apellido..."
        />
      </div>

      <select
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
        className="filter-select"
      >
        <option value="">Estado: Todas</option>
        <option value="1">Pendiente</option>
        <option value="2">Activa</option>
        <option value="3">Vencida</option>
        <option value="4">Suspendida</option>
        <option value="5">Cancelada</option>
      </select>

      <select
        value={filtroVencimiento}
        onChange={(e) => setFiltroVencimiento(e.target.value)}
        className="filter-select"
      >
        <option value="">Vencimiento: todos</option>
        <option value="7">Por vencer (7 días)</option>
        <option value="30">Por vencer (30 días)</option>
      </select>

      <select
        value={filtroPlan}
        onChange={(e) => setFiltroPlan(e.target.value)}
        className="filter-select"
      >
        <option value="">Plan: todos</option>
        {planes.map((plan) => (
          <option key={plan.id} value={plan.nombre}>{plan.nombre}</option>
        ))}
      </select>
    </div>
  );
}

export default MembresiasFiltros;
