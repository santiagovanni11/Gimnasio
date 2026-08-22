// =========================================================
// FILA DE PRECIOS — Inputs y acciones de la tabla de planes
// =========================================================

const CAMPOS_PRECIO = [
  { clave: "precio1Mes", titulo: "1 mes" },
  { clave: "precio3Meses", titulo: "3 meses" },
  { clave: "precio6Meses", titulo: "6 meses" },
  { clave: "precio12Meses", titulo: "12 meses" },
];

function PrecioInput({
  plan,
  campo,
  preciosEditando,
  setPreciosEditando,
  enEdicion,
}) {
  return (
    <td>
      <input
        type="number"
        min="1"
        step="0.01"
        value={preciosEditando[plan.id]?.[campo] ?? ""}
        disabled={!enEdicion}
        onChange={(e) =>
          setPreciosEditando((anterior) => ({
            ...anterior,
            [plan.id]: {
              ...anterior[plan.id],
              [campo]: e.target.value,
            },
          }))
        }
      />
    </td>
  );
}

/** Botonera guardar/cancelar/editar de una fila de precios. */
function AccionesPrecio({
  plan,
  planEditando,
  guardandoPrecios,
  guardarPreciosPlan,
  cancelarEdicionPrecios,
}) {
  if (planEditando !== plan.id) {
    return (
      <button
        type="button"
        className="edit-button"
        onClick={() => cancelarEdicionPrecios(true, plan.id)}
      >
        Editar
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        type="button"
        className="primary-small-button"
        disabled={guardandoPrecios}
        onClick={() => guardarPreciosPlan(plan.id)}
      >
        {guardandoPrecios ? "Guardando..." : "Guardar"}
      </button>

      <button
        type="button"
        className="secondary-button"
        disabled={guardandoPrecios}
        onClick={() => cancelarEdicionPrecios(false)}
      >
        Cancelar
      </button>
    </div>
  );
}

export { CAMPOS_PRECIO, PrecioInput, AccionesPrecio };
