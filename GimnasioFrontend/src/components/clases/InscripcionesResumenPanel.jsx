import { ESTADO_INSCRIPCION, estadoInscripcionTexto } from "../../utils/inscripcionesClase";

function InscripcionesResumenPanel({ inscriptos = [] }) {
  const resumen = {
    confirmadas: inscriptos.filter((i) => Number(i.estado) === ESTADO_INSCRIPCION.CONFIRMADA).length,
    reservas: inscriptos.filter((i) => Number(i.estado) === ESTADO_INSCRIPCION.RESERVADA).length,
    canceladas: inscriptos.filter((i) => Number(i.estado) === ESTADO_INSCRIPCION.CANCELADA).length,
    noAsistio: inscriptos.filter((i) => Number(i.estado) === ESTADO_INSCRIPCION.NO_ASISTIO).length,
  };

  const items = [
    { titulo: "Confirmadas", valor: resumen.confirmadas },
    { titulo: "Reservas", valor: resumen.reservas },
    { titulo: "Canceladas", valor: resumen.canceladas },
    { titulo: "No asistió", valor: resumen.noAsistio },
  ];

  return (
    <div className="inscriptos-resumen">
      <div className="inscriptos-resumen-header">
        <span>Estado del grupo</span>
        <div className="table-actions compact-actions">
          <button type="button" className="approve-button">
            Marcar asistencia
          </button>
          <button type="button" className="secondary-button">
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="inscriptos-metricas">
        {items.map((item) => (
          <div key={item.titulo} className="inscriptos-metric">
            <span>{item.titulo}</span>
            <strong>{item.valor}</strong>
          </div>
        ))}
      </div>

      <div className="inscriptos-legend">
        {inscriptos.slice(0, 3).map((inscripcion) => (
          <span key={inscripcion.id} className="inscripcion-tag">
            {inscripcion.socioNombre} {estadoInscripcionTexto(inscripcion.estado)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default InscripcionesResumenPanel;
