// =========================================================
// TARJETA DE ASISTENCIA POR HORARIO
// Inscriptos vigentes del horario con su marca del día y los
// botones Presente/Ausente. Marca nueva: todos los roles;
// corregir una ya cargada: Admin + Recepcionista.
// =========================================================

import CupoChip from "../clases/CupoChip";
import {
  diaSemanaTexto,
  franjaTexto,
} from "../../utils/clases";
import {
  estadoAccesoSocio,
  marcaDeInscripcion,
  resumenDeMarcas,
} from "../../utils/asistencias";

function TarjetaAsistenciaHorario({
  clase,
  horario,
  inscriptos,
  asistenciasDelDia,
  fecha,
  puedeEditar,
  onMarcar,
}) {
  const marcas = inscriptos
    .map((i) => marcaDeInscripcion(
      asistenciasDelDia, i.id, fecha))
    .filter(Boolean);

  const resumen = resumenDeMarcas(
    inscriptos.length, marcas);

  return (
    <section className="content-card horarios-panel">
      <div className="section-header">
        <div>
          <h3>
            {clase.nombre} · {franjaTexto(
              horario.horaInicio, horario.horaFin)} hs
          </h3>

          <p>
            {diaSemanaTexto(horario.diaSemana)} ·{" "}
            {horario.empleadoNombre}{" "}
            {horario.empleadoApellido}
          </p>
        </div>

        <div className="section-actions">
          <span className="status-active">✓ {resumen.presentes}</span>
          <span className="status-rejected">✗ {resumen.ausentes}</span>
          <CupoChip ocupados={inscriptos.length}
            capacidad={clase.capacidadMaxima} />
        </div>
      </div>

      {inscriptos.length === 0 ? (
        <div className="empty-state">
          Este horario no tiene inscriptos.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Socio</th>
                <th>Acceso</th>
                <th>Marca</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {inscriptos.map((inscripcion) => {
                const marca = marcaDeInscripcion(
                  asistenciasDelDia, inscripcion.id, fecha);
                const acceso = estadoAccesoSocio(inscripcion, fecha);
                const bloqueada = Boolean(marca) && !puedeEditar;
                const sinAcceso = acceso === "Sin acceso";

                return (
                  <tr key={inscripcion.id}>
                    <td>
                      <div>
                        <strong>{inscripcion.socioNombre}{" "}{inscripcion.socioApellido}</strong>
                      </div>
                      <small style={{ color: "#8b929c" }}>
                        {acceso === "Activo" ? "Acceso vigente" : acceso}
                      </small>
                    </td>

                    <td>
                      <span className={
                        sinAcceso ? "status-rejected" : acceso === "Reserva" ? "status-warning" : "status-active"
                      }>
                        {acceso}
                      </span>
                    </td>

                    <td>
                      {!marca ? (
                        <span className="status-inactive">
                          Sin marcar
                        </span>
                      ) : (
                        <span className={
                          marca.presente
                            ? "status-active"
                            : "status-rejected"
                        }>
                          {marca.motivo === "justificado"
                            ? "Justificado"
                            : marca.motivo === "reserva"
                            ? "Reserva"
                            : marca.presente
                            ? "Presente"
                            : "Ausente"}
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="table-actions" style={{ gap: 8 }}>
                        <button type="button"
                          className="approve-button"
                          disabled={bloqueada || sinAcceso || marca?.presente === true}
                          onClick={() =>
                            onMarcar({
                              inscripcion,
                              presente: true,
                            })}>
                          Presente
                        </button>

                        <button type="button"
                          className="delete-button"
                          disabled={bloqueada || marca && marca.presente === false}
                          onClick={() =>
                            onMarcar({
                              inscripcion,
                              presente: false,
                            })}>
                          Ausente
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TarjetaAsistenciaHorario;
