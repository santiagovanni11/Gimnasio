// =========================================================
// HOOK FILTROS DE PRECIOS
// Búsqueda por nombre y filtro por estado (todos/activos/
// pausados). Devuelve la lista ya filtrada de planes.
// =========================================================

import { useState, useMemo } from "react";

export function useFiltrosPrecios(planes = []) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const planesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return planes.filter((p) => {
      const okTexto = !q || p.nombre.toLowerCase().includes(q);
      const okEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && p.activo !== false) ||
        (filtroEstado === "pausados" && p.activo === false);
      return okTexto && okEstado;
    });
  }, [planes, busqueda, filtroEstado]);

  return { busqueda, setBusqueda, filtroEstado, setFiltroEstado, planesFiltrados };
}
