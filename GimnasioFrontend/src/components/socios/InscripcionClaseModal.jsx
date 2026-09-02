// =========================================================
// INSCRIBIR SOCIO A CLASES — MODAL
// Arriba: lo que el socio ya tiene (clase, día y hora).
// Abajo: inscribirlo a otro horario con cupo libre.
// =========================================================

import {
  diaSemanaTexto,
  franjaTexto,
} from "../../utils/clases";

function InscripcionClaseModal({
  inscripcionClaseAbierta, socioParaInscribir, catalogoClases,
  claseElegida, horarioElegido, cargandoCatalogo,
  guardandoInscripcionClase, errorInscripcionClase,
  confirmacionInscripcionClase,
  horariosConCupo, inscripcionesActuales,
  cerrarInscripcionClases, seleccionarClaseDesdeSocio,
  seleccionarHorarioDesdeSocio, guardarInscripcionDesdeSocio,
}) {
  if (!inscripcionClaseAbierta) return null;

  const horarios = horariosConCupo();
  const actuales = inscripcionesActuales();

  return (
    <div className="payment-modal-backdrop"
      onClick={cerrarInscripcionClases}>
      <div className="payment-modal"
        onClick={(event) => event.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">CLASES</span>
            <h3>Inscribir a clases</h3>
            {socioParaInscribir && (
              <p>{socioParaInscribir.nombre} {socioParaInscribir.apellido}</p>
            )}
          </div>

          <button type="button" className="close-button"
            onClick={cerrarInscripcionClases}>
            ×
          </button>
        </div>

        {socioParaInscribir?.sinAccesoAClases ? (
          <div className="payment-ticket-body">
            <p className="error-message">
              El plan de este socio no incluye acceso a clases, por
              lo que no puede inscribirse a ninguna clase.
            </p>

            <div className="payment-modal-actions">
              <button type="button" className="primary-button"
                onClick={cerrarInscripcionClases}>
                Cerrar
              </button>
            </div>
          </div>
        ) : cargandoCatalogo ? (
          <div className="info-message" style={{ padding: "16px" }}>
            Cargando clases...
          </div>
        ) : (
          <>
            <div style={{ padding: "0 16px" }}>
              <h4>Sus clases actuales</h4>

              {actuales.length === 0 ? (
                <p style={{ color: "#8b929c" }}>
                  Todavía no está inscripto a ninguna clase.
                </p>
              ) : (
                actuales.map((i) => (
                  <p key={i.id}>
                    Ya está inscripto a{" "}
                    <strong>{i.claseNombre}</strong>, los{" "}
                    {diaSemanaTexto(i.diaSemana)} de{" "}
                    {franjaTexto(i.horaInicio, i.horaFin)} hs
                    {i.vencida ? " (vencida)" : ""}.
                  </p>
                ))
              )}

              <hr />
              <h4>Inscribir a otra clase</h4>
              <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#8b929c" }}>
                Podés anotar al socio en varias clases, una por una, sin cerrar la ventana.
              </p>
            </div>

            <form onSubmit={(event) => {
              event.preventDefault();
              guardarInscripcionDesdeSocio();
            }}>
              <div className="payment-ticket-body">
                <div className="input-group">
                  <label>Clase</label>

                  <select value={claseElegida}
                    onChange={(e) =>
                      seleccionarClaseDesdeSocio(e.target.value)}
                    required autoFocus>
                    <option value="" disabled>Seleccioná una clase…</option>

                    {(catalogoClases?.clases ?? []).map((clase) => (
                      <option key={clase.id} value={clase.id}>
                        {clase.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {claseElegida && (
                  <div className="input-group">
                    <label>Horario</label>

                    <select value={horarioElegido}
                      onChange={(e) =>
                        seleccionarHorarioDesdeSocio(e.target.value)}
                      required>
                      <option value="" disabled>Seleccioná un horario…</option>

                      {horarios.map((horario) => (
                        <option key={horario.id} value={horario.id}
                          disabled={horario.bloqueado}>
                          {horario.texto}
                        </option>
                      ))}

                      {!horarios.length && (
                        <option value="" disabled>
                          Esta clase no tiene horarios
                        </option>
                      )}
                    </select>
                  </div>
                )}

                {confirmacionInscripcionClase && (
                  <p className="success-message">{confirmacionInscripcionClase}</p>
                )}

                {errorInscripcionClase && (
                  <p className="error-message">{errorInscripcionClase}</p>
                )}
              </div>

              <div className="payment-modal-actions">
                <button type="button" className="secondary-button"
                  onClick={cerrarInscripcionClases}>
                  Cancelar
                </button>

                <button type="submit" className="primary-small-button"
                  disabled={guardandoInscripcionClase ||
                    !claseElegida || !horarioElegido}>
                  {guardandoInscripcionClase
                    ? "Inscribiendo..."
                    : "Confirmar inscripción"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default InscripcionClaseModal;
