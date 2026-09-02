// =========================================================
// FORMULARIO DE HORARIO — MODAL
// Franja semanal de una clase: día, horas y profesor libre
// en esa franja. Campos compartidos con "Nueva clase".
// =========================================================

import CamposFranjaProfesor from "./CamposFranjaProfesor";

function FormularioHorarioModal({
  horarioModalAbierto,
  claseDestino,
  horarioEditando,
  camposHorario,
  guardandoHorario,
  errorHorario,
  profesoresDisponibles,
  cerrarModalHorario,
  cambiarCampoHorario,
  guardarHorario,
}) {
  if (!horarioModalAbierto) return null;

  const enEdicion = Boolean(horarioEditando);
  const nombreClase =
    claseDestino?.nombre ?? horarioEditando?.claseNombre ?? "";

  return (
    <div className="payment-modal-backdrop" onClick={cerrarModalHorario}>
      <div className="payment-modal"
        onClick={(event) => event.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">HORARIOS</span>

            <h3>
              {enEdicion
                ? "Editar horario"
                : `Horario para ${nombreClase}`}
            </h3>
          </div>

          <button type="button" className="close-button"
            onClick={cerrarModalHorario}>
            ×
          </button>
        </div>

        <form onSubmit={guardarHorario}>
          <div className="payment-ticket-body">
            <CamposFranjaProfesor
              campos={camposHorario}
              cambiarCampo={cambiarCampoHorario}
              disponibles={profesoresDisponibles()}
            />

            {errorHorario && (
              <p className="error-message">{errorHorario}</p>
            )}
          </div>

          <div className="payment-modal-actions">
            <button type="button" className="secondary-button"
              onClick={cerrarModalHorario}>
              Cancelar
            </button>

            <button type="submit" className="primary-small-button"
              disabled={guardandoHorario}>
              {guardandoHorario
                ? "Guardando..."
                : enEdicion
                ? "Guardar cambios"
                : "Agregar horario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioHorarioModal;
