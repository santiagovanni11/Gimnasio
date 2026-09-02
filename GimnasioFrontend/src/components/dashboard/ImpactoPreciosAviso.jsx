// =========================================================
// AVISO DE IMPACTO EN EL EDITOR DE PRECIOS
// Traduce el cálculo del simulador a una línea clara:
// socios afectados y diferencia mensual estimada.
// =========================================================

import { formatoMoneda } from "../../utils/pagos";
import { calcularImpactoCambio } from "../../utils/simuladorPrecios";

function ImpactoPreciosAviso({
  plan,
  valoresNuevos,
  membresias,
}) {
  const { afectados, diferenciaMensual } = calcularImpactoCambio({
    plan,
    valoresNuevos,
    membresias,
  });

  if (!afectados) {
    return (
      <small className="impacto-precios">
        Este plan no tiene socios activos: sin impacto directo.
      </small>
    );
  }

  const suba = diferenciaMensual >= 0;
  const clase = suba ? "status-active" : "status-rejected";
  const signo = suba ? "+" : "−";

  return (
    <small className="impacto-precios">
      Afecta a{" "}
      <strong>
        {afectados} socio{afectados === 1 ? "" : "s"} activo
        {afectados === 1 ? "" : "s"}
      </strong>{" "}
      · si rigiera hoy,{" "}
      <span className={clase}>
        {signo}
        {formatoMoneda(Math.abs(diferenciaMensual))}/mes estimado
      </span>
    </small>
  );
}

export default ImpactoPreciosAviso;
