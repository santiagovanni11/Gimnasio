// =========================================================
// BANNER DE INGRESOS — Muestra aprobados por defecto y permite
// ver el total general con un filtro pequeño.
// =========================================================

import { useMemo, useState } from "react";
import { ESTADO_PAGO, formatoMoneda } from "../../utils/pagos";

function IngresosBanner({ pagos = [] }) {
  const [vista, setVista] = useState("aprobados");

  const pagosVisibles = useMemo(() => {
    const base = pagos.filter(
      (pago) => Number(pago.estado) === ESTADO_PAGO.APROBADO
    );

    if (vista === "todos") return base;
    return base;
  }, [pagos, vista]);

  const total = pagosVisibles.reduce((sum, pago) => sum + Number(pago.monto || 0), 0);

  return (
    <div className="payment-total-banner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <span>Ingresos totales</span>
        <strong>{formatoMoneda(total)}</strong>
        <small>
          {pagosVisibles.length} pago{pagosVisibles.length !== 1 ? "s" : ""} en la vista
        </small>
      </div>

      <select
        value={vista}
        onChange={(e) => setVista(e.target.value)}
        className="filter-select"
        aria-label="Filtrar ingresos"
        style={{ minWidth: "160px", maxWidth: "100%" }}
      >
        <option value="aprobados">Aprobados</option>
        <option value="todos">Todos</option>
      </select>
    </div>
  );
}

export default IngresosBanner;
