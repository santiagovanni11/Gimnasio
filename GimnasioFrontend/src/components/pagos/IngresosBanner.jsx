// =========================================================
// BANNER DE INGRESOS — Total filtrado de la vista de pagos
// =========================================================

import { formatoMoneda } from "../../utils/pagos";

function IngresosBanner({ pagos = [] }) {
  const totalAprobado = pagos
    .filter((pago) => Number(pago.estado) === 2)
    .reduce((total, pago) => total + Number(pago.monto || 0), 0);

  return (
    <div className="payment-total-banner">
      <span>Ingresos totales (filtrados)</span>

      <strong>{formatoMoneda(totalAprobado)}</strong>

      <small>
        {pagos.length} pago{pagos.length !== 1 ? "s" : ""} en la vista
      </small>
    </div>
  );
}

export default IngresosBanner;
