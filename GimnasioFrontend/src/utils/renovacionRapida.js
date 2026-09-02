// =========================================================
// renovacionRapida.js — Lógica pura de renovación rápida
// (desacoplada del hook para mantenerlo delgado).
// =========================================================

import { mesesEscalonEntre, sumarMesesIso } from "./membresias";
import { aISO, fechaDesdeValor, fechaTexto } from "./fechas";
import { formatoMoneda } from "./pagos";

/** Duración y precio de la renovación; null si faltan datos. */
export function resolverDatosRenovacion(
  membresia,
  getPlanes,
  obtenerPrecioSegunDuracion
) {
  const meses = mesesEscalonEntre(membresia.fechaInicio, membresia.fechaFin);
  if (!meses) return null;

  const plan = (getPlanes?.() ?? []).find(
    (p) => Number(p.id) === Number(membresia.planId)
  );

  const precio = Number(obtenerPrecioSegunDuracion?.(plan, meses) || 0);
  return precio > 0 ? { meses, precio } : null;
}

/** Texto de confirmación de la renovación en un paso. */
export function mensajeConfirmarRenovacion({ membresia, meses, precio }) {
  return (
    `${membresia.socioNombre} ${membresia.socioApellido}: ` +
    `${meses} ${meses === 1 ? "mes" : "meses"}, ` +
    `del ${fechaTexto(aISO(fechaDesdeValor(membresia.fechaFin)))} ` +
    `al ${fechaTexto(sumarMesesIso(membresia.fechaFin, meses))} ` +
    `por ${formatoMoneda(precio)}. ¿Continuar?`
  );
}
