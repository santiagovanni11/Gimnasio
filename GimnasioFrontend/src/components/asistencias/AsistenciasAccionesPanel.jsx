// =========================================================
// ACCIONES DEL MODULO DE ASISTENCIAS
// Exportación del listado del día y contexto de control.
// =========================================================

function AsistenciasAccionesPanel({ onExportar, disabled = false }) {
  return (
    <div className="section-actions" style={{ marginBottom: 14, justifyContent: "flex-end" }}>
      <button
        type="button"
        className="export-button"
        onClick={onExportar}
        disabled={disabled}
        title="Exportar asistencia a CSV"
      >
        Exportar CSV
      </button>
    </div>
  );
}

export default AsistenciasAccionesPanel;
