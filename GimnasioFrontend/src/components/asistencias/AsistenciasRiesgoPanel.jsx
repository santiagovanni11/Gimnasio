// =========================================================
// WAITLIST Y RIESGO OPERATIVO
// Muestra reservas, ausencias y estado de riesgo de la
// operación para actuar antes de que se complique el día.
// =========================================================

import {
  ESTADO_INSCRIPCION,
  estadoInscripcionTexto,
} from "../../utils/inscripcionesClase";

const formatearFecha = (valor) => {
  if (!valor) return "-";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-AR");
};

function AsistenciasRiesgoPanel({
  inscripciones = [],
  horarios = [],
  clases = [],
}) {
  const horariosPorId = new Map(horarios.map((h) => [Number(h.id), h]));
  const clasesPorId = new Map(clases.map((c) => [Number(c.id), c]));

  const filas = [...inscripciones]
    .filter((i) =>
      [ESTADO_INSCRIPCION.RESERVADA, ESTADO_INSCRIPCION.NO_ASISTIO]
        .includes(Number(i.estado))
    )
    .sort((a, b) => new Date(b.fechaHasta ?? b.fechaInscripcion ?? 0) - new Date(a.fechaHasta ?? a.fechaInscripcion ?? 0))
    .slice(0, 6)
    .map((inscripcion) => {
      const horario = horariosPorId.get(Number(inscripcion.horarioClaseId));
      const clase = horario ? clasesPorId.get(Number(horario.claseId)) : null;

      return { ...inscripcion, horario, clase };
    });

  return (
    <section className="content-card" style={{ padding: 16, marginBottom: 16 }}>
      <div className="section-header">
        <div>
          <h3 style={{ margin: 0 }}>Waitlist y riesgo</h3>
          <p style={{ margin: "6px 0 0" }}>
            Reservas y ausencias que requieren revisión operativa.
          </p>
        </div>
      </div>

      {filas.length === 0 ? (
        <div className="empty-state">Sin alertas operativas.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Socio</th>
                <th>Clase</th>
                <th>Estado</th>
                <th>Vigencia</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.id ?? `${fila.socioId}-${fila.horarioClaseId}`}>
                  <td>
                    {fila.socioNombre ?? "-"} {fila.socioApellido ?? ""}
                  </td>
                  <td>
                    {fila.clase?.nombre ?? "-"}
                    <div style={{ color: "#8b929c", fontSize: 12 }}>
                      {fila.horario ? `${fila.horario.horaInicio} a ${fila.horario.horaFin}` : "-"}
                    </div>
                  </td>
                  <td>
                    <span className={fila.estado === ESTADO_INSCRIPCION.RESERVADA ? "status-warning" : "status-rejected"}>
                      {estadoInscripcionTexto(fila.estado)}
                    </span>
                  </td>
                  <td>
                    {formatearFecha(fila.fechaHasta ?? fila.fechaInscripcion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AsistenciasRiesgoPanel;
