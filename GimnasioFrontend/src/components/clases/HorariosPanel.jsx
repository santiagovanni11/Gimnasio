// =========================================================
// PANEL DE HORARIOS DE UNA CLASE
// Franjas semanales ordenadas por día y hora, con profesor y
// cupo en vivo. Seleccionar una franja despliega inscriptos.
// Alta/edición/eliminación según permisos (Administrador).
// =========================================================

import CupoChip from "./CupoChip";
import {
  diaSemanaTexto,
  franjaTexto,
  compararHorarios,
} from "../../utils/clases";
import { cupoDeHorario } from "../../utils/inscripcionesClase";

function HorariosPanel({
  clase,
  horarios,
  inscripciones,
  seleccionado,
  puedeGestionarHorarios,
  onAgregar,
  onEditar,
  onEliminar,
  onVerInscriptos,
}) {
  const ordenados = [...horarios].sort(compararHorarios);
  const esSeleccionado = (horario) =>
    Number(seleccionado?.id) === Number(horario.id);

  return (
    <section className="content-card horarios-panel">
      <div className="section-header">
        <div>
          <h3>Horarios de {clase.nombre}</h3>
          <p>
            {ordenados.length === 0
              ? "Todavía no tiene franjas horarias."
              : `${ordenados.length} franja${
                  ordenados.length === 1 ? "" : "s"
                } semanal${ordenados.length === 1 ? "" : "e"}.`}
          </p>
        </div>

        {puedeGestionarHorarios && (
          <div className="section-actions">
            <button type="button" className="primary-small-button"
              onClick={onAgregar}>
              + Agregar horario
            </button>
          </div>
        )}
      </div>

      {ordenados.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Franja</th>
                <th>Profesor</th>
                <th>Cupo</th>
                {puedeGestionarHorarios && (
                  <>
                    <th></th>
                    <th></th>
                  </>
                )}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {ordenados.map((horario) => {
                const cupo = cupoDeHorario(
                  inscripciones, horario, clase.capacidadMaxima);

                return (
                  <tr key={horario.id}>
                    <td><strong>{diaSemanaTexto(horario.diaSemana)}</strong></td>
                    <td>{franjaTexto(horario.horaInicio, horario.horaFin)} hs</td>
                    <td>{horario.empleadoNombre} {horario.empleadoApellido}</td>
                    <td><CupoChip {...cupo} /></td>

                    {puedeGestionarHorarios && (
                      <>
                        <td>
                          <button type="button" className="edit-button"
                            onClick={() => onEditar(horario)}>
                            Editar
                          </button>
                        </td>
                        <td>
                          <button type="button" className="delete-button"
                            onClick={() => onEliminar(horario)}>
                            Eliminar
                          </button>
                        </td>
                      </>
                    )}

                    <td>
                      <button type="button"
                        className={
                          esSeleccionado(horario)
                            ? "approve-button"
                            : "view-button"
                        }
                        onClick={() =>
                          onVerInscriptos(
                            esSeleccionado(horario)
                              ? null
                              : horario
                          )
                        }>
                        Inscriptos
                      </button>
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

export default HorariosPanel;
