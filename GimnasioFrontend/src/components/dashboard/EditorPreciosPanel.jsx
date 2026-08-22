// =========================================================
// PANEL DE EDICIÓN DE PRECIOS
// Fila expandible bajo el plan en edición: vigencia con
// ayuda contextual y acciones principales.
// =========================================================

function EditorPreciosPanel({
  plan,
  fechaRige,
  setFechaRige,
  guardandoPrecios,
  guardarPreciosPlan,
  cancelarEdicionPrecios,
}) {
  return (
    <tr className="fila-editor-precios">
      <td colSpan={6}>
        <div className="editor-precios-panel">
          <div className="editor-precios-info">
            <strong>Editando precios · {plan.nombre}</strong>

            <small>
              Dejá la fecha vacía para que rija hoy; si elegís una
              futura, queda programado y visible en el historial.
            </small>
          </div>

          <div className="campo-vigencia">
            <label>Rige desde</label>

            <input
              type="date"
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
