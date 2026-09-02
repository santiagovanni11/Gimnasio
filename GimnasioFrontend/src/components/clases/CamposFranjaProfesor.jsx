// =========================================================
// CAMPOS DE FRANJA + PROFESOR
// Bloque reutilizable por "Agregar horario" y por "Nueva
// clase" (primer horario opcional): profesor libre según
// disponibilidad, día y franja horaria.
// =========================================================

import { DIAS_SEMANA } from "../../utils/clases";

function CamposFranjaProfesor({
  campos,
  cambiarCampo,
  disponibles = [],
  tituloProfesor = "Profesor",
}) {
  const franjaIncompleta =
    (campos.diaSemana || campos.diaSemana === 0) &&
    (!campos.horaInicio || !campos.horaFin);

  const elegidoInvalido =
    Boolean(campos.empleadoId) &&
    !disponibles.some(
      (p) =>
        String(p.empleadoId) ===
        String(campos.empleadoId)
    );

  return (
    <>
      <div className="input-group">
        <label>{tituloProfesor}</label>

        <select value={campos.empleadoId}
          onChange={(e) =>
            cambiarCampo("empleadoId", e.target.value)}>
          <option value="" disabled>
            Seleccioná un profesor…
          </option>

          {disponibles.map((p) => (
            <option key={p.empleadoId} value={p.empleadoId}>
              {p.apellido}, {p.nombre}
            </option>
          ))}
        </select>

        {!disponibles.length && (
          <small className="error-message">
            Todos los profesores ya están asignados a otra clase en ese día y horario.
          </small>
        )}

        {elegidoInvalido && (
          <small className="error-message">
            Este profesor ya está asignado a otra clase en ese día y horario: seleccioná otro.
          </small>
        )}
      </div>

      <div className="input-group">
        <label>Día</label>

        <select value={campos.diaSemana}
          onChange={(e) =>
            cambiarCampo("diaSemana", e.target.value)}
          required>
          <option value="" disabled>Seleccioná un día…</option>

          {DIAS_SEMANA.map(({ valor, etiqueta }) => (
            <option key={valor} value={valor}>{etiqueta}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Franja horaria</label>

        <input type="time" value={campos.horaInicio}
          onChange={(e) =>
            cambiarCampo("horaInicio", e.target.value)}
          required />

        <input type="time" value={campos.horaFin}
          onChange={(e) => cambiarCampo("horaFin", e.target.value)}
          required />

        {franjaIncompleta && campos.empleadoId && (
          <small style={{ color: "#8b929c" }}>
            Completá ambas horas para ver profesores libres.
          </small>
        )}
      </div>
    </>
  );
}

export default CamposFranjaProfesor;
