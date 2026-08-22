// =========================================================
// CÁLCULOS DEL FORMULARIO DE MEMBRESÍA
// Socios disponibles para el combo, precio mostrado según
// plan/duración y propagación de la selección de socio.
// =========================================================

import { useMemo } from "react";
import { precioSegunDuracion } from "../utils/planes";
import { sociosSinMembresiaActiva } from "../utils/membresias";

export function useCalculoFormularioMembresia({
  socios,
  membresias,
  membresiasRechazadasIds,
  membresiaEditando,
  planes,
  planSeleccionado,
  duracionMembresia,
  setSocioSeleccionado,
  setMembresiaExistente,
  setMostrarAvisoMembresiaExistente,
}) {
  /**
   * Combo limitado a socios ACTIVOS sin membresía vigente.
   * En edición se garantiza la presencia del socio actual.
   */
  const sociosDisponibles = useMemo(() => {
    const activos = socios.filter((s) => s.activo !== false);

    const filtrados = sociosSinMembresiaActiva(
      activos,
      membresias,
      membresiasRechazadasIds
    );

    if (!membresiaEditando) return filtrados;

    const idActual = Number(membresiaEditando.socioId);
    const yaEsta = filtrados.some((s) => Number(s.id) === idActual);

    if (yaEsta) return filtrados;

    const actual = activos.find((s) => Number(s.id) === idActual);
    return actual ? [...filtrados, actual] : filtrados;
  }, [socios, membresias, membresiasRechazadasIds, membresiaEditando]);

  const precioMostrado = (() => {
    const plan = planes.find(
      (p) => p.id === Number(planSeleccionado)
    );

    if (!plan || !duracionMembresia) return "$0,00";

    return `$${precioSegunDuracion(plan, duracionMembresia).toLocaleString(
      "es-AR",
      { minimumFractionDigits: 2 }
    )}`;
  })();

  /** Propaga selección de socio + aviso si ya tiene una activa. */
  const alCambiarSocio = (socioId, existente) => {
    setSocioSeleccionado(socioId);
    setMembresiaExistente(existente);
    setMostrarAvisoMembresiaExistente(Boolean(existente));
  };

  return { sociosDisponibles, precioMostrado, alCambiarSocio };
}
