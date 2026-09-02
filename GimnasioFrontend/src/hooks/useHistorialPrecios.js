// =========================================================
// HISTORIAL DE PRECIOS (auditoría) — extraído de usePlanes
// para mantener el hook de planes enfocado en planes/edición.
// =========================================================

import { useState } from "react";
import { planesService } from "../services/planesService";

export function useHistorialPrecios() {
  const [planHistorial, setPlanHistorial] = useState(null);
  const [filasHistorial, setFilasHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const verHistorial = async (plan) => {
    setPlanHistorial(plan);
    setFilasHistorial([]);
    setCargandoHistorial(true);

    try {
      const { respuesta, datos } = await planesService.historialPrecios(plan.id);
      if (!respuesta.ok) return;
      setFilasHistorial(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error("Error al obtener historial:", error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const cerrarHistorial = () => {
    setPlanHistorial(null);
    setFilasHistorial([]);
  };

  return {
    planHistorial,
    filasHistorial,
    cargandoHistorial,
    verHistorial,
    cerrarHistorial,
  };
}
