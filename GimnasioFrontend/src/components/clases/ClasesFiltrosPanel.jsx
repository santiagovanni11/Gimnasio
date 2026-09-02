import { DIAS_SEMANA } from "../../utils/clases";

function ClasesFiltrosPanel({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroDia,
  setFiltroDia,
  filtroProfesor,
  setFiltroProfesor,
  horarios = [],
  profesores = [],
}) {
  const profesoresActivos = profesores.length
    ? [...new Set(
        profesores
          .filter((profesor) => profesor?.activo !== false)
          .map((profesor) => `${profesor.nombre ?? ""} ${profesor.apellido ?? ""}`.trim())
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b))
    : [...new Set(
        horarios
          .map((h) => `${h.empleadoNombre ?? ""} ${h.empleadoApellido ?? ""}`.trim())
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b));

  return (
    <div className="clases-filtros">
      <div className="search-box">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar clase por nombre..."
        />
      </div>

      <select
        className="rol-select"
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
      >
        <option value="activas">Activas</option>
        <option value="todas">Todas</option>
        <option value="desactivadas">Desactivadas</option>
      </select>

      <select
        className="rol-select"
        value={filtroDia}
        onChange={(e) => setFiltroDia(e.target.value)}
      >
        <option value="">Todos los días</option>
        {DIAS_SEMANA.map((dia) => (
          <option key={dia.valor} value={dia.valor}>
            {dia.etiqueta}
          </option>
        ))}
      </select>

      <select
        className="rol-select"
        value={filtroProfesor}
        onChange={(e) => setFiltroProfesor(e.target.value)}
      >
        <option value="">Todos los profesores</option>
        {profesoresActivos.map((profesor) => (
          <option key={profesor} value={profesor}>
            {profesor}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ClasesFiltrosPanel;
