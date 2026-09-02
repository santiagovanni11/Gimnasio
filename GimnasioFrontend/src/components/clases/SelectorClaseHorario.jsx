// =========================================================
// SELECTOR DE CLASE Y HORARIO — Inscripción masiva
// Elige clase y luego horario de esa clase, con cupo en vivo
// según la selección actual de socios.
// =========================================================

import { useEffect } from "react";
import { diaSemanaTexto, franjaTexto } from "../../utils/clases";
import { cupoDeHorario } from "../../utils/inscripcionesClase";

function SelectorClaseHorario({
  clases = [],
  horarios = [],
  inscripciones = [],
  claseDestino,
  seleccionarClase,
  horarioDestino,
  seleccionarHorario,
  cantidadSeleccionada,
  onCupo,
}) {
  const claseElegida = clases.find(
    (c) => String(c.id) === String(claseDestino)
  );
  const horariosDeLaClase = claseElegida
    ? horarios.filter(
        (h) => String(h.claseId) === String(claseElegida.id)
      )
    : [];
  const horarioElegido = horariosDeLaClase.find(
    (h) => String(h.id) === String(horarioDestino)
  );
  const cupo = horarioElegido
    ? cupoDeHorario(
        inscripciones, horarioElegido,
        claseElegida?.capacidadMaxima)
    : null;
  const sinCupo =
    cupo && cantidadSeleccionada > cupo.libres;

  useEffect(() => {
    onCupo?.(cupo);
  }, [cupo, onCupo]);

  return (
    <>
      <div className="input-group">
        <label>Clase</label>
        <select value={claseDestino}
          onChange={(e) => seleccionarClase(e.target.value)}
          required>
          <option value="" disabled>
            Seleccioná una clase…
          </option>
          {clases.filter((c) => c.activa !== false)
            .map((clase) => (
              <option key={clase.id} value={clase.id}>
                {clase.nombre}
              </option>
            ))}
        </select>
      </div>

      {claseElegida && (
        <div className="input-group">
          <label>Horario</label>
          <select value={horarioDestino}
            onChange={(e) => seleccionarHorario(e.target.value)}
            required>
            <option value="" disabled>
              Seleccioná un horario…
            </option>
            {horariosDeLaClase.map((horario) => (
              <option key={horario.id} value={horario.id}>
                {diaSemanaTexto(horario.diaSemana)}{" "}
                {franjaTexto(
                  horario.horaInicio, horario.horaFin)}
              </option>
            ))}
            {!horariosDeLaClase.length && (
              <option value="" disabled>
                Esta clase no tiene horarios.
              </option>
            )}
          </select>
        </div>
      )}

      {cupo && (
        <small className={
          sinCupo ? "error-message" : "inscripcion-masiva-resumen"
        }>
          {cupo.libres} lugares libres en el horario
          {sinCupo && " · la selección supera el cupo"}
        </small>
      )}
    </>
  );
}

export default SelectorClaseHorario;