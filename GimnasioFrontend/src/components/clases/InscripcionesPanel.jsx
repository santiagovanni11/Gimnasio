// =========================================================
// PANEL DE INSCRIPTOS DE UN HORARIO
// Lista de inscriptos con su estado, cancelación y acceso al
// alta. Se muestra bajo el panel de horarios.
// =========================================================

import CupoChip from "./CupoChip";
import InscripcionesResumenPanel from "./InscripcionesResumenPanel";
import { diaSemanaTexto, franjaTexto } from "../../utils/clases";
import {
  cupoDeHorario,
  estadoInscripcionTexto,
  claseEstadoInscripcion,
  ocupaCupo,
  ESTADO_INSCRIPCION,
} from "../../utils/inscripcionesClase";

function InscripcionesPanel({
  horario,
  clase,
  inscripciones,
  socios = [],
  puedeGestionar,
  onInscribir,
  onCancelar,
}) {
  const cupo = cupoDeHorario(
    inscripciones, horario, clase.capacidadMaxima);

  const inscriptos = inscripciones
    .filter(
      (i) => Number(i.horarioClaseId) === Number(horario.id))
    .sort((a, b) =>
      a.socioNombre.localeCompare(b.socioNombre));

  const seleccionables = socios.filter(
    (socio) =>
      socio.activo !== false &&
      !socio.sinAccesoAClases &&
      !inscriptos.some(
        (i) =>
          Number(i.socioId) === Number(socio.id) &&
          ocupaCupo(i)));

  return (
    <section className="content-card horarios-panel">
      <div className="section-header">
        <div>
          <h3>
            Inscriptos · {diaSemanaTexto(horario.diaSemana)}{" "}
            {franjaTexto(horario.horaInicio, horario.horaFin)}
          </h3>

          <p><CupoChip {...cupo} /></p>
        </div>

        {puedeGestionar && !cupo.lleno && (
          <div className="section-actions">
            <button type="button" className="primary-small-button"
              onClick={onInscribir}
              disabled={!seleccionables.length}
              title={
                seleccionables.length
                  ? ""
                  : "Todos los socios activos ya están inscriptos"
              }>
              + Inscribir socio
            </button>
          </div>
        )}
      </div>

      <InscripcionesResumenPanel inscriptos={inscriptos} />

      {inscriptos.length === 0 ? (
        <div className="empty-state">
          No hay inscriptos en este horario todavía.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Socio</th>
                <th>Estado</th>
                <th>Vence</th>
                <th>Inscripto</th>
                {puedeGestionar && <th></th>}
              </tr>
            </thead>

            <tbody>
              {inscriptos.map((inscripcion) => (
                <tr key={inscripcion.id}>
                  <td>
                    {inscripcion.socioNombre}{" "}
                    {inscripcion.socioApellido}
                  </td>

                  <td>
                    <span className={
                      inscripcion.vencida
                        ? "status-inactive"
                        : claseEstadoInscripcion(
                            inscripcion.estado)}>
                      {inscripcion.vencida
                        ? "Vencida"
                        : estadoInscripcionTexto(
                            inscripcion.estado)}
                    </span>
                  </td>

                  <td>{inscripcion.fechaHasta
                    ? String(inscripcion.fechaHasta).slice(0, 10)
                    : "-"}</td>

                  <td>{String(
                    inscripcion.fechaInscripcion || ""
                  ).slice(0, 10)}</td>

                  {puedeGestionar && (
                    <td>
                      {!inscripcion.vencida &&
                        Number(inscripcion.estado) !==
                          ESTADO_INSCRIPCION.CANCELADA && (
                        <button type="button"
                          className="delete-button"
                          onClick={() =>
                            onCancelar(inscripcion)}
                          title="Libera el cupo, conserva historial">
                          Cancelar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default InscripcionesPanel;
