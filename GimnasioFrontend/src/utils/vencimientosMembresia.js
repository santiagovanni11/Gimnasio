// =========================================================
// UTILIDADES DE VENCIMIENTO DE MEMBRESÍAS
// Cálculo de días restantes y clasificación visual del chip.
// Usado por la tabla y por los filtros de "por vencer".
// =========================================================

const MS_POR_DIA = 86400000;

/** Días completos entre hoy y la fecha de fin (negativo = vencida). */
export const diasParaVencer = (fechaFin) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fin = new Date(fechaFin);
  fin.setHours(0, 0, 0, 0);

  return Math.round((fin.getTime() - hoy.getTime()) / MS_POR_DIA);
};

/**
 * Chip de vencimiento para membresías ACTIVAS:
 * - rojo cuando quedan 7 días o menos
 * - amarillo cuando quedan 8 a 30
 * - null cuando hay tiempo de sobra (no satura la vista)
 */
export const chipVencimiento = (membresia) => {
  const dias = diasParaVencer(membresia.fechaFin);

  if (dias > 30) return null;

  const texto =
    dias === 1 ? "vence mañana"
    : dias === 0 ? "vence hoy"
    : `${dias} día${Math.abs(dias) === 1 ? "" : "s"}`;

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
