// =========================================================
// HOOK DE FILTROS DE PAGOS
// Estado y lógica combinada de filtros: plan, forma de pago,
// rango de fechas y búsqueda previa (texto).
// =========================================================

import { useMemo, useState } from "react";
import { coincideFiltroPlan } from "../utils/planes";

// Rechazados/cancelados/anulados no se listan en ingresos.
const esListable = (pago) => ![3, 4, 5].includes(Number(pago.estado));

/**
 * @param {object} p - { pagosFiltrados, membresias }
 * pagosFiltrados: lista ya pasada por la búsqueda de texto.
 */
export function useFiltrosPagos({ pagosFiltrados, membresias }) {
  const [filtroPlan, setFiltroPlan] = useState("");
  const [filtroFormaPago, setFiltroFormaPago] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const pagosConFiltros = useMemo(
    () =>
      pagosFiltrados.filter((pago) => {
        if (!esListable(pago)) return false;

        if (
          filtroPlan &&
          !coincideFiltroPlan(pago, filtroPlan, membresias)
        ) {
          return false;
        }

        if (
          filtroFormaPago &&
          String(pago.formaPago) !== filtroFormaPago
        ) {
          return false;
        }

        const fecha = pago.fechaPago
          ? pago.fechaPago.slice(0, 10)
          : "";

        if (fechaDesde && fecha < fechaDesde) return false;
        if (fechaHasta && fecha > fechaHasta) return false;

        return true;
      }),
    [
      pagosFiltrados,
      membresias,
      filtroPlan,
      filtroFormaPago,
      fechaDesde,
      fechaHasta,
    ]
  );

  const limpiarFiltros = () => {
    setFiltroPlan("");
    setFiltroFormaPago("");
    setFechaDesde("");
    setFechaHasta("");
  };

  return {
    filtroPlan,
    setFiltroPlan,
    filtroFormaPago,
    setFiltroFormaPago,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    limpiarFiltros,
    pagosConFiltros,
  };
}
