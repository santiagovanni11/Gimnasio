// =========================================================
// PANEL DE EDICIÓN DE PRECIOS
// Fila expandible bajo el plan en edición: vigencia con
// ayuda contextual, simulador de impacto y acciones.
// =========================================================

import ImpactoPreciosAviso from "./ImpactoPreciosAviso";

function EditorPreciosPanel({
  plan,
  fechaRige,
  setFechaRige,
  guardandoPrecios,
  guardarPreciosPlan,
  cancelarEdicionPrecios,
  preciosEditando,
  membresias,
}) {
  return (
    <tr className="fila-editor-precios">
      <td colSpan={7}>
        <div className="editor-precios-panel">
          <div className="editor-precios-info">
            <strong>Editando precios · {plan.nombre}</strong>

            <small>
              Dejá la fecha vacía para que rija hoy; si elegís una
              futura, queda programado y visible en el historial.
            </small>

            <ImpactoPreciosAviso
              plan={plan}
              valoresNuevos={preciosEditando[plan.id] ?? {}}
              membresias={membresias ?? []}
            />
          </div>

          <div className="campo-vigencia">
            <label>Rige desde</label>

            <input
              type="date"
              className="input-fecha"
              value={fechaRige}
              onChange={(e) => setFechaRige?.(e.target.value)}
            />
          </div>

          <div className="editor-precios-acciones">
            <button
              type="button"
              className="secondary-button"
              onClick={() => cancelarEdicionPrecios(false)}
              disabled={guardandoPrecios}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="primary-small-button"
              disabled={guardandoPrecios}
              onClick={() => guardarPreciosPlan(plan.id)}
            >
              {guardandoPrecios ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default EditorPreciosPanel;
