// =========================================================
// FORMULARIO NUEVO PLAN
// Modal de alta: nombre, descripción, duración y escalón de
// precios con validación ascendente. Estado desde useNuevoPlan.
// =========================================================

import { CAMPOS_ESCALON, errorEscalonCelda } from "../../utils/preciosConfig";

function FormularioNuevoPlan({
  nuevoPlanAbierto,
  camposNuevoPlan,
  escalonNuevoPlan,
  guardandoNuevoPlan,
  errorNuevoPlan,
  cerrarNuevoPlan,
  cambiarCampoNuevoPlan,
  cambiarPrecioNuevoPlan,
  guardarNuevoPlan,
}) {
  if (!nuevoPlanAbierto) return null;

  return (
    <div
      className="payment-modal-backdrop"
      onClick={cerrarNuevoPlan}
    >
      <div
        className="payment-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">PLANES</span>

            <h3>Nuevo plan</h3>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={cerrarNuevoPlan}
          >
            ×
          </button>
        </div>

        <form onSubmit={guardarNuevoPlan}>
          <div className="payment-ticket-body">
            <div className="input-group">
              <label>Nombre</label>

              <input
                type="text"
                value={camposNuevoPlan.nombre}
                onChange={(e) =>
                  cambiarCampoNuevoPlan("nombre", e.target.value)
                }
                maxLength={100}
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <label>Descripción (opcional)</label>

              <input
                type="text"
                value={camposNuevoPlan.descripcion}
                onChange={(e) =>
                  cambiarCampoNuevoPlan("descripcion", e.target.value)
                }
                maxLength={200}
              />
            </div>

            {CAMPOS_ESCALON.map(({ clave, titulo }) => (
              <div className="input-group" key={clave}>
                <label>Precio {titulo}</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={escalonNuevoPlan[clave] ?? ""}
                  onChange={(e) =>
                    cambiarPrecioNuevoPlan(clave, e.target.value)
                  }
                  required
                />

                {errorEscalonCelda(escalonNuevoPlan, clave) && (
                  <small className="error-message">
                    {errorEscalonCelda(escalonNuevoPlan, clave)}
                  </small>
                )}
              </div>
            ))}

            {errorNuevoPlan && (
              <p className="error-message">{errorNuevoPlan}</p>
            )}
          </div>

          <div className="payment-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={cerrarNuevoPlan}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-small-button"
              disabled={guardandoNuevoPlan}
            >
              {guardandoNuevoPlan ? "Creando..." : "Crear plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioNuevoPlan;
