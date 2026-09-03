/* EditorBeneficiosClasesPlan - Modal para asociar beneficios/clases */

import { useState } from "react";
import SelectorBeneficiosClases from "./SelectorBeneficiosClases";

export default function EditorBeneficiosClasesPlan({
  abierto,
  plan,
  beneficiosDisp = [],
  clasesDisp = [],
  seleccionB = [],
  seleccionC = [],
  guardando = false,
  creando = false,
  eliminarBeneficio,
  toggleB,
  toggleC,
  guardar,
  crearBeneficio,
  cerrar,
}) {
  const [nuevoBeneficio, setNuevoBeneficio] = useState("");
  const [borrandoId, setBorrandoId] = useState(null);

  const alBorrar = async (id) => {
    setBorrandoId(id);
    await eliminarBeneficio(id);
    setBorrandoId(null);
  };

  if (!abierto || !plan) return null;

  return (
      <div
        className="payment-modal-backdrop"
        onClick={cerrar}
      >
      <div
        className="payment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">PLAN</span>
            <h3>Beneficios y clases · {plan.nombre}</h3>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={cerrar}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "16px 22px 0" }}>
          <h4 style={{ marginBottom: "10px" }}>
            ¿Falta un beneficio en el catálogo?
          </h4>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div
              className="input-group"
              style={{ flex: "1 1 240px", marginBottom: 0 }}
            >
              <label htmlFor="nuevo-beneficio">Nombre</label>
              <input
                id="nuevo-beneficio"
                type="text"
                placeholder="Ej: Acceso a sauna"
                value={nuevoBeneficio}
                onChange={(e) => setNuevoBeneficio(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    crearBeneficio(nuevoBeneficio);
                    setNuevoBeneficio("");
                  }
                }}
              />
            </div>

            <button
              type="button"
              className="primary-small-button"
              disabled={creando}
              onClick={() => {
                crearBeneficio(nuevoBeneficio);
                setNuevoBeneficio("");
              }}
            >
              {creando ? "Agregando..." : "Añadir beneficio"}
            </button>
          </div>

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
            onEliminarBeneficio={alBorrar}
            eliminandoBeneficioId={borrandoId}
          />
        </div>

        <div className="payment-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={cerrar}
          >
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
