// =========================================================
// ASIGNAR CLASE A PROFESOR — MODAL
// Arriba: sus franjas actuales. Abajo: todas las franjas
// registradas de las clases, con botón para pasarlas a este
// profesor (cambia el docente asignado, sin carga manual).
// =========================================================

import {
  diaSemanaTexto,
  franjaTexto,
} from "../../utils/clases";

function AsignarClaseModal({
  asignacionAbierta, profesorDestino,
  cargandoAsignacion, guardandoAsignacion,
  errorAsignacion, asignacionesActuales,
  disponiblesParaAsignar,
  cerrarAsignacionClases, asignarClaseAProfesor,
}) {
  if (!asignacionAbierta) return null;

  const actuales = asignacionesActuales();
  const disponibles = disponiblesParaAsignar();

  return (
    <div className="payment-modal-backdrop"
      onClick={cerrarAsignacionClases}>
      <div className="payment-modal"
        onClick={(event) => event.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">CLASES</span>
            <h3>Clases del profesor</h3>
            {profesorDestino && (
              <p>{profesorDestino.nombre} {profesorDestino.apellido}</p>
            )}
          </div>

          <button type="button" className="close-button"
            onClick={cerrarAsignacionClases}>
            ×
          </button>
        </div>

        {cargandoAsignacion ? (
          <div className="info-message" style={{ padding: "16px" }}>
            Cargando clases...
          </div>
        ) : (
          <div style={{ padding: "0 16px 12px", maxHeight: "60vh",
            overflowY: "auto" }}>
            <h4>Sus franjas actuales</h4>

            {actuales.length === 0 ? (
              <p style={{ color: "#8b929c" }}>
                Todavía no tiene franjas asignadas.
              </p>
            ) : (
              actuales.map((horario) => (
                <p key={`actual-${horario.id}`}>
                  ✔ <strong>{horario.claseNombre}</strong> ·{" "}
                  {diaSemanaTexto(horario.diaSemana)}{" "}
                  {franjaTexto(horario.horaInicio, horario.horaFin)} hs
                </p>
              ))
            )}

            <hr />
            <h4>Franjas registradas para asignarle</h4>

            {disponibles.length === 0 ? (
              <p style={{ color: "#8b929c" }}>
                No hay franjas de otros profesores disponibles.
              </p>
            ) : (
              disponibles.map((horario) => (
                <div key={horario.id}
                  style={{ display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center", gap: "8px",
                    padding: "4px 0" }}>
                  <span>
                    <strong>{horario.claseNombre}</strong> ·{" "}
                    {diaSemanaTexto(horario.diaSemana)}{" "}
                    {franjaTexto(horario.horaInicio, horario.horaFin)} hs
                    <small style={{ color: "#8b929c",
                      display: "block" }}>
                      Actual: {horario.profesorActual || "-"}
                    </small>
                  </span>

                  <button type="button"
                    className="approve-button"
                    disabled={
                      String(guardandoAsignacion) ===
                      String(horario.id)}
                    onClick={() =>
                      asignarClaseAProfesor(horario)}>
                    {String(guardandoAsignacion) ===
                      String(horario.id)
                      ? "..."
                      : "Asignar"}
                  </button>
                </div>
              ))
            )}

            {errorAsignacion && (
              <p className="error-message"
                style={{ marginTop: "10px" }}>
                {errorAsignacion}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AsignarClaseModal;
