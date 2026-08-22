// =========================================================
// FILA DE PRECIOS — Inputs con validación en vivo,
// equivalente mensual/% de ahorro y acciones de fila.
// =========================================================

import { equivalenciaMensual } from "../../utils/preciosConfig";

function PrecioInput({
  plan,
  campo,
  meses,
  valores,
  setPreciosEditando,
  enEdicion,
  validarCelda,
}) {
  const error = enEdicion
    ? (validarCelda?.(plan.id, campo) ?? "")
    : "";

  const { cuotaTexto, ahorroTexto } = enEdicion
    ? { cuotaTexto: "", ahorroTexto: "" }
    : equivalenciaMensual(
        valores[campo],
        meses,
        plan.precio1Mes
      );

  return (
    <td>
      <input
        type="number"
        min="0"
        step="0.01"
        value={valores[campo] ?? ""}
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

      {enEdicion && error && (
        <small
          className="error-message"
          style={{ display: "block", marginTop: "4px" }}
        >
          {error}
        </small>
      )}

      {!enEdicion && cuotaTexto && (
        <small style={{ display: "block", color: "#8b929c" }}>
          {cuotaTexto}
          {ahorroTexto ? ` · ${ahorroTexto}` : ""}
        </small>
      )}
    </td>
  );
}
export { PrecioInput };
