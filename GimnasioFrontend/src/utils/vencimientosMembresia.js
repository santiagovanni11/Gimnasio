// =========================================================
// UTILIDADES DE VENCIMIENTO DE MEMBRESÍAS
// Cálculo de días restantes y clasificación visual del chip.
// Usado por la tabla y por los filtros de "por vencer".
// =========================================================

import { MS_POR_DIA, fechaDesdeValor } from "./fechas";

/**
 * Días completos entre hoy y la fecha de fin (negativo = vencida).
 * Acepta día calendario ("2026-08-30") e instantes; siempre
 * opera en horario local para evitar corrimientos por UTC.
 */
export const diasParaVencer = (fechaFin) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fin = fechaDesdeValor(fechaFin);
  fin.setHours(0, 0, 0, 0);

  return Math.round((fin.getTime() - hoy.getTime()) / MS_POR_DIA);
};

/**
 * Chip de vencimiento junto a la columna Vencimiento:
 * - solo membresías ACTIVAS (las vencidas ya lo indican en su
 *   columna Estado, y suspendidas/canceladas no corren contra
 *   el calendario)
 * - rojo cuando quedan 7 días o menos (incluye "vence hoy" y
 *   "vence mañana")
 * - amarillo cuando quedan 8 a 30 días ("30 días", "29 días"…)
 * - null fuera de la ventana (no satura la vista)
 */
export const chipVencimiento = (membresia) => {
  if (Number(membresia.estado) !== 2) return null;

  const dias = diasParaVencer(membresia.fechaFin);

  if (dias < 0 || dias > 30) return null;

  const texto =
    dias === 1 ? "vence mañana"
    : dias === 0 ? "vence hoy"
    : `${dias} día${dias === 1 ? "" : "s"}`;

  return {
    texto,
    clase: dias <= 7 ? "status-blocked" : "status-warning",
  };
};

/**
 * ¿Entra la membresía en una ventana de "por vencer"?
 * ventanaDias: 7 o 30. Solo considera activas (estado 2).
 */
export const enVentanaDeVencimiento = (membresia, ventanaDias) => {
  const activa = Number(membresia.estado) === 2;

  if (!activa || !ventanaDias) return false;

  const dias = diasParaVencer(membresia.fechaFin);

  return dias >= 0 && dias <= ventanaDias;
};
