// =========================================================
// FILTROS OPERATIVOS DE ASISTENCIAS
// Separa el control del día por clase y profesor para no
// depender solo del scroll ni del estado visual del listado.
// =========================================================

function AsistenciasFiltrosPanel({ horarios = [], clases = [], filtros, setFiltros }) {
  const nombreClase = (claseId) =>
    (clases.find((c) => Number(c.id) === Number(claseId))?.nombre ?? "") ||
    horarios.find((h) => Number(h.claseId) === Number(claseId))?.claseNombre ||
    `Clase #${claseId}`;

  const clasesFiltradas = [...new Set(horarios.map((h) => Number(h.claseId)))]
    .sort((a, b) => nombreClase(a).localeCompare(nombreClase(b)));
  const profesores = [...new Set(
    horarios
      .filter((h) => h.empleadoNombre || h.empleadoApellido)
      .map((h) => `${h.empleadoNombre ?? ""} ${h.empleadoApellido ?? ""}`.trim())
      .filter(Boolean)
  )];

  const limpiar = () => setFiltros({ claseId: "", profesor: "" });

  return (
    <div className="content-card" style={{ marginBottom: 16, padding: 16 }}>
      <div className="section-header" style={{ alignItems: "end" }}>
        <div>
          <h3 style={{ margin: 0 }}>Filtros operativos</h3>
          <p style={{ margin: "6px 0 0" }}>
            Control por clase y profesor para operar sin perder contexto.
          </p>
        </div>

        <div className="section-actions" style={{ gap: 10, flexWrap: "wrap" }}>
          <select
            value={filtros.claseId}
            onChange={(e) => setFiltros((prev) => ({ ...prev, claseId: e.target.value }))}
            style={{ minWidth: 180 }}
          >
            <option value="">Todas las clases</option>
            {clasesFiltradas.map((claseId) => (
              <option key={claseId} value={claseId}>
                {nombreClase(claseId)}
              </option>
            ))}
          </select>

          <select
            value={filtros.profesor}
            onChange={(e) => setFiltros((prev) => ({ ...prev, profesor: e.target.value }))}
            style={{ minWidth: 180 }}
          >
            <option value="">Todos los profesores</option>
            {profesores.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </select>

          <button type="button" className="secondary-button" onClick={limpiar}>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsistenciasFiltrosPanel;
