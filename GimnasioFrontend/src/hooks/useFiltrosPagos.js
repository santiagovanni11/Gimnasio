// =========================================================
// HOOK DE FILTROS DE PAGOS
// Estado y lógica combinada: plan, forma de pago, rango de
// fechas, búsqueda previa, estado y orden. Devuelve la lista
// ya filtrada y ordenada (pagosConFiltros).
// =========================================================

import { useMemo, useState } from "react";
import { coincideFiltroPlan } from "../utils/planes";
import { esListable, ESTADO_PAGO } from "../utils/pagos";

const ordenarPagos = (lista, orden) => {
  const copia = [...lista];
  switch (orden) {
    case "fecha_asc":
      return copia.sort((a, b) => (a.fechaPago || "").localeCompare(b.fechaPago || ""));
    case "monto_desc":
      return copia.sort((a, b) => Number(b.monto) - Number(a.monto));
    case "monto_asc":
      return copia.sort((a, b) => Number(a.monto) - Number(b.monto));
    case "fecha_desc":
    default:
      return copia.sort((a, b) => (b.fechaPago || "").localeCompare(a.fechaPago || ""));
  }
};

export function useFiltrosPagos({ pagosFiltrados, membresias }) {
  const [filtroPlan, setFiltroPlan] = useState("");
  const [filtroFormaPago, setFiltroFormaPago] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [ordenPagos, setOrdenPagos] = useState("fecha_desc");

  const filtrados = useMemo(
    () =>
      pagosFiltrados.filter((pago) => {
        if (filtroEstado) {
          if (Number(pago.estado) !== ESTADO_PAGO[filtroEstado]) return false;
        } else {
          if (Number(pago.estado) !== ESTADO_PAGO.APROBADO) return false;
          if (!esListable(pago)) return false;
        }

        if (filtroPlan && !coincideFiltroPlan(pago, filtroPlan, membresias)) {
          return false;
        }

        if (filtroFormaPago && String(pago.formaPago) !== filtroFormaPago) {
          return false;
        }

        const fecha = pago.fechaPago ? pago.fechaPago.slice(0, 10) : "";
        if (fechaDesde && fecha < fechaDesde) return false;
        if (fechaHasta && fecha > fechaHasta) return false;

        return true;
      }),
    [
      pagosFiltrados,
      membresias,
      filtroPlan,
      filtroFormaPago,
      filtroEstado,
      fechaDesde,
      fechaHasta,
    ]
  );

  const pagosConFiltros = useMemo(
    () => ordenarPagos(filtrados, ordenPagos),
    [filtrados, ordenPagos]
  );

  const limpiarFiltros = () => {
    setFiltroPlan("");
    setFiltroFormaPago("");
    setFiltroEstado("");
    setFechaDesde("");
    setFechaHasta("");
  };

  return {
    filtroPlan,
    setFiltroPlan,
    filtroFormaPago,
    setFiltroFormaPago,
    filtroEstado,
    setFiltroEstado,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    ordenPagos,
    setOrdenPagos,
    limpiarFiltros,
    pagosConFiltros,
  };
}
