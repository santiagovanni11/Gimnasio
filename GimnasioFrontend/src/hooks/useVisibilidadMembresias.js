// =========================================================
// VISIBILIDAD DEL LISTADO DE MEMBRESÍAS
// Encapsula los filtros de estado y ventana de vencimiento,
// más el orden por columnas. Devuelve el listado final.
// =========================================================

import { useMemo, useState } from "react";
import { useOrdenTabla } from "./useOrdenTabla";
import { enVentanaDeVencimiento } from "../utils/vencimientosMembresia";

export function useVisibilidadMembresias(membresiasFiltradas) {
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroVencimiento, setFiltroVencimiento] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("");
  const { orden, toggleOrden, ordenar } = useOrdenTabla("fechaFin");

  // Filtro por estado manual del listado
  const porEstado = useMemo(
    () =>
      filtroEstado
        ? membresiasFiltradas.filter(
            (m) => String(m.estado) === filtroEstado
          )
        : membresiasFiltradas,
    [membresiasFiltradas, filtroEstado]
  );

  // Filtro de ventana de vencimiento (solo activas)
  const porVencimiento = useMemo(
    () =>
      filtroVencimiento
        ? porEstado.filter((m) =>
            enVentanaDeVencimiento(
              m,
              Number(filtroVencimiento)
            )
          )
        : porEstado,
    [porEstado, filtroVencimiento]
  );

  // Filtro por plan (nombre del plan de la membresía)
  const porPlan = useMemo(
    () =>
      filtroPlan
        ? porVencimiento.filter((m) => m.planNombre === filtroPlan)
        : porVencimiento,
    [porVencimiento, filtroPlan]
  );

  const membresiasVisibles = useMemo(
    () => ordenar(porPlan),
    [porPlan, ordenar]
  );

  return {
    filtroEstado,
    setFiltroEstado,
    filtroVencimiento,
    setFiltroVencimiento,
    filtroPlan,
    setFiltroPlan,
    orden,
    toggleOrden,
    membresiasVisibles,
  };
}
