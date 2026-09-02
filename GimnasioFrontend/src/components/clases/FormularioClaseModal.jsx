// =========================================================
// FORMULARIO DE CLASE — MODAL
// Alta: datos de la clase + primer horario opcional con
// profesor asignado. Edición: solo datos de la clase.
// =========================================================

import CamposFranjaProfesor from "./CamposFranjaProfesor";

function FormularioClaseModal({
  claseModalAbierto,
  claseEditando,
  camposClase,
  guardandoClase,
  errorClase,
  profesoresDisponibles,
  cerrarModalClase,
  cambiarCampoClase,
  guardarClase,
}) {
  if (!claseModalAbierto) return null;

  const enEdicion = Boolean(claseEditando);

  return (
    <div className="payment-modal-backdrop" onClick={cerrarModalClase}>
      <div className="payment-modal"
        onClick={(event) => event.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">CLASES</span>

            <h3>{enEdicion ? "Editar clase" : "Nueva clase"}</h3>
          </div>

          <button type="button" className="close-button"
            onClick={cerrarModalClase}>
            ×
          </button>
        </div>

        <form onSubmit={guardarClase}>
          <div className="payment-ticket-body">
            <div className="input-group">
              <label>Nombre</label>

              <input type="text" value={camposClase.nombre}
                onChange={(e) =>
                  cambiarCampoClase("nombre", e.target.value)}
                maxLength={100} required autoFocus />
            </div>

            <div className="input-group">
              <label>Descripción (opcional)</label>

              <input type="text" value={camposClase.descripcion}
                onChange={(e) =>
                  cambiarCampoClase("descripcion", e.target.value)}
                maxLength={200} />
            </div>

            <div className="input-group">
              <label>Duración (minutos)</label>

              <input type="number" min="1"
                value={camposClase.duracionMinutos}
                onChange={(e) =>
                  cambiarCampoClase(
                    "duracionMinutos", e.target.value)}
                placeholder="Ej. 45" required />
            </div>

            <div className="input-group">
              <label>Capacidad máxima</label>

              <input type="number" min="1"
                value={camposClase.capacidadMaxima}
                onChange={(e) =>
                  cambiarCampoClase(
                    "capacidadMaxima", e.target.value)}
                placeholder="Ej. 20" required />
            </div>

            {!enEdicion && (
              <>
                <small style={{ color: "#8b929c" }}>
                  Primer horario (opcional): podés asignarle
                  profesor al crearla.
                </small>

                <CamposFranjaProfesor
                  campos={camposClase}
                  cambiarCampo={cambiarCampoClase}
                  disponibles={profesoresDisponibles()}
                  tituloProfesor="Asignar profesor" />
              </>
            )}

            {errorClase && (
              <p className="error-message">{errorClase}</p>
            )}
          </div>

          <div className="payment-modal-actions">
            <button type="button" className="secondary-button"
              onClick={cerrarModalClase}>
              Cancelar
            </button>

            <button type="submit" className="primary-small-button"
              disabled={guardandoClase}>
              {guardandoClase
                ? "Guardando..."
                : enEdicion
                ? "Guardar cambios"
                : "Crear clase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioClaseModal;
