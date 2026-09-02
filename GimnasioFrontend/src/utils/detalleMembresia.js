// =========================================================
// DETALLE DE MEMBRESÍA — CÁLCULOS
// Pagos asociados al período e historia consolidada del
// socio dueño (antigüedad y aporte total).
// =========================================================

import { esAprobado } from "./pagos";

/** Pagos de una membresía, el más reciente primero. */
export const pagosDeMembresia = (pagos = [], membresiaId) =>
  pagos
    .filter(
      (pago) =>
        Number(pago.membresiaId) === Number(membresiaId)
    )
    .sort((a, b) =>
      String(b.fechaPago).localeCompare(String(a.fechaPago))
    );

/** Total aprobado de las membresías indicadas (histórico). */
const totalAportado = (pagos = [], idsMembresias) =>
  pagos.reduce(
    (total, pago) =>
      idsMembresias.has(Number(pago.membresiaId)) &&
      esAprobado(pago)
        ? total + Number(pago.monto || 0)
        : total,
    0
  );

/**
 * Historia consolidada del socio dueño de la membresía:
 * desde cuándo es socio, cuántas membresías registró y
 * cuánto aportó en total (todos los períodos).
 */
export const resumenSocio = (
  membresias = [],
  pagos = [],
  socioId
) => {
  const propias = membresias.filter(
    (m) => Number(m.socioId) === Number(socioId)
  );

  const ids = new Set(propias.map((m) => Number(m.id)));

  return {
    desde: propias
      .map((m) => m.fechaCreacion)
      .filter(Boolean)
      .sort()[0],
    registradas: propias.length,
    totalHistorico: totalAportado(pagos, ids),
  };
};
