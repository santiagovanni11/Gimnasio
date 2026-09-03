/* EditorBeneficiosClasesPlan - Modal para asociar beneficios/clases */

import SelectorBeneficiosClases from "./SelectorBeneficiosClases";
import CamposNuevaEntrada from "./CamposNuevaEntrada";

export default function EditorBeneficiosClasesPlan({
  abierto,
  plan,
  beneficiosDisp = [],
  clasesDisp = [],
  seleccionB = [],
  seleccionC = [],
  guardando = false,
  creando = false,
  toggleB,
  toggleC,
  guardar,
  crearBeneficio,
  crearClase,
  cerrar,
}) {
  if (!abierto || !plan) return null;

  return (
    <div className="payment-modal-backdrop" onClick={cerrar}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">PLAN</span>
            <h3>Beneficios y clases · {plan.nombre}</h3>
          </div>

          <button type="button" className="close-button" onClick={cerrar}>
            ×
          </button>
        </div>

        <div style={{ padding: "16px 22px 0" }}>
          <h4 style={{ marginBottom: "10px" }}>
            ¿Falta en el catálogo?
          </h4>

          <CamposNuevaEntrada
            titulo="Nuevo beneficio"
            placeholder="Ej: Acceso a sauna"
            etiquetaBoton="Añadir beneficio"
            creando={creando}
            onCrear={crearBeneficio}
          />

          <CamposNuevaEntrada
            titulo="Nueva clase"
            placeholder="Ej: Yoga"
            etiquetaBoton="Añadir clase"
            creando={creando}
            onCrear={crearClase}
          />

          <small
            className="info-message"
            style={{ marginTop: "8px", display: "block" }}
          >
            Se crea en el catálogo y queda seleccionado; guardá los
            cambios para asociarlo al plan.
          </small>
        </div>

        <div className="payment-ticket-body">
          <SelectorBeneficiosClases
            beneficios={beneficiosDisp}
            clases={clasesDisp}
            seleccionB={seleccionB}
            seleccionC={seleccionC}
            onToggleB={toggleB}
            onToggleC={toggleC}
          />
        </div>

        <div className="payment-modal-actions">
          <button type="button" className="secondary-button" onClick={cerrar}>
            Cancelar
          </button>

          <button
            type="button"
            className="primary-small-button"
            disabled={guardando}
            onClick={guardar}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
