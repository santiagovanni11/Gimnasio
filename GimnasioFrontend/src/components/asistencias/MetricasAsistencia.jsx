// =========================================================
// PANEL DE MÉTRICAS DE ASISTENCIA
// Tasa de presencia por franja horaria en un rango (7 o 30
// días). Ordenado de menor a mayor: arriba, lo que conviene
// revisar. Presentación pura sobre datos ya cargados.
// =========================================================

import { useState } from "react";
import { diaSemanaTexto, franjaTexto } from "../../utils/clases";
import {
  rangoUltimosDias,
  resumenAsistenciaPorHorario,
  claseTasaAsistencia,
} from "../../utils/metricasAsistencias";

const RANGOS = [
  { dias: 7, etiqueta: "Últimos 7 días" },
  { dias: 30, etiqueta: "Últimos 30 días" },
];

function MetricasAsistencia({
  clases = [],
  horarios = [],
  inscripciones = [],
  asistencias = [],
  filtros = { claseId: "", profesor: "" },
  fecha,
}) {
  const [dias, setDias] = useState(30);

  const hoyReferencia = fecha ? new Date(`${fecha}T12:00:00`) : new Date();

  const horariosFiltrados = horarios.filter((h) => {
    const coincideClase =
      !filtros.claseId || String(h.claseId) === String(filtros.claseId);
    const nombreProfesor = `${h.empleadoNombre ?? ""} ${h.empleadoApellido ?? ""}`.trim();
    const coincideProfesor =
      !filtros.profesor || nombreProfesor === filtros.profesor;
    return coincideClase && coincideProfesor;
  });

  const filas = resumenAsistenciaPorHorario({
    horarios: horariosFiltrados,
    clases,
    inscripciones,
    asistencias,
    ...rangoUltimosDias(dias, hoyReferencia),
  });

  return (
    <section className="content-card horarios-panel">
      <div className="section-header">
        <div>
          <h3>Asistencia por horario</h3>

          <p>
            Tasa de presencia para decidir qué franjas
            funcionan.
          </p>
        </div>

        <div className="section-actions">
          {RANGOS.map((rango) => (
            <button key={rango.dias} type="button"
              className={
                dias === rango.dias
                  ? "primary-small-button"
                  : "secondary-button"
              }
              onClick={() => setDias(rango.dias)}>
              {rango.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {filas.length === 0 ? (
        <div className="empty-state">
          Sin asistencias registradas en el período.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Clase</th>
                <th>Día</th>
                <th>Franja</th>
                <th>Marcas</th>
                <th>Presentes</th>
                <th>Tasa</th>
              </tr>
            </thead>

            <tbody>
              {filas.map((fila) => (
                <tr key={fila.horario.id}>
                  <td><strong>{fila.clase?.nombre ?? "-"}</strong></td>
                  <td>{diaSemanaTexto(fila.horario.diaSemana)}</td>
                  <td>{franjaTexto(
                    fila.horario.horaInicio,
                    fila.horario.horaFin)} hs</td>
                  <td>{fila.marcas}</td>
                  <td>
                    {fila.presentes}/{fila.marcas}
                    {" "}
                    <small style={{ color: "#8b929c" }}>
                      ({fila.inscriptos}/{fila.capacidad} inscriptos)
                    </small>
                  </td>
                  <td>
                    <span className={claseTasaAsistencia(fila.tasa)}>
                      {Math.round(fila.tasa * 100)}%
                    </span>
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

export default MetricasAsistencia;
