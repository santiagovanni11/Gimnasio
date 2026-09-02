// =========================================================
// FILTROS DE SOCIOS — Membresía y morosidad
// La búsqueda por texto y el toggle de inactivos viven en
// SociosAcciones; aquí van los filtros cruzados con
// membresías y pagos.
// =========================================================

function SociosFiltros({
  filtroMembresia,
  setFiltroMembresia,
  soloMorosos,
  setSoloMorosos,
  filtroEstadoMembresia,
  setFiltroEstadoMembresia,
  filtroEstadoSocio,
  setFiltroEstadoSocio,
}) {
  return (
    <div className="section-actions" style={{ marginBottom: "1rem" }}>
      <select
        value={filtroEstadoSocio}
        onChange={(e) => setFiltroEstadoSocio(e.target.value)}
        className="filter-select"
        title="Filtrar por estado real del socio"
      >
        <option value="">Estado real: todos</option>
        <option value="activo">Activos</option>
        <option value="inactivo">Inactivos</option>
        <option value="moroso">Moroso / con deuda</option>
        <option value="vencido">Vencidos</option>
        <option value="sin_membresia">Sin membresía</option>
        <option value="cumpleanero">Cumpleañeros</option>
      </select>

      <select
        value={filtroEstadoMembresia}
        onChange={(e) => setFiltroEstadoMembresia(e.target.value)}
        className="filter-select"
        title="Filtrar por estado de membresía"
      >
        <option value="">Membresía: todas</option>
        <option value="vigente">Vigente</option>
        <option value="porVencer">Por vencer</option>
        <option value="vencida">Vencida</option>
        <option value="sin">Sin membresía</option>
        <option value="rechazada">Rechazada</option>
      </select>

      <select
        value={filtroMembresia}
        onChange={(e) => setFiltroMembresia(e.target.value)}
        className="filter-select"
      >
        <option value="">Vigencia: todas</option>
        <option value="vigente">Con membresía vigente</option>
        <option value="sin">Sin membresía vigente</option>
      </select>

      <label
        className="quick-range-button"
        style={{ cursor: "pointer" }}
      >
        <input
          type="checkbox"
          checked={soloMorosos}
          onChange={(e) => setSoloMorosos(e.target.checked)}
          style={{ marginRight: "6px" }}
        />
        Solo morosos
      </label>
    </div>
  );
}

export default SociosFiltros;
