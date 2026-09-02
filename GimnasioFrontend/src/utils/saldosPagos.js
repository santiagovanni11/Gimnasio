// =========================================================
// SALDOS Y MOROSOS DE PAGOS
// Cálculos de saldos por membresía usados por PagosSection.
// Los totales aprobados se limitan al período vigente
// (ver utils/pagosPeriodo).
// =========================================================

import {
  totalAprobadoDelPeriodoPorMembresia,
} from "./pagosPeriodo";

/** Mapa membresiaId -> precio aplicado. */
export const calcularPrecioPorMembresia = (membresias = []) =>
  new Map(
    membresias.map((m) => [Number(m.id), Number(m.precioAplicado || 0)])
  );

/**
 * Mapa pagoId -> { pagado, saldo } según su membresía.
 * "pagado" considera solo aprobados del período actual.
 */
export const calcularSaldoPorPago = (pagos = [], membresias = []) => {
  const pagadoPorMembresia =
    totalAprobadoDelPeriodoPorMembresia(pagos, membresias);

  const precioPorMembresia =
    calcularPrecioPorMembresia(membresias);

  const mapa = new Map();

  pagos.forEach((pago) => {
    const memId = Number(pago.membresiaId);
    const pagado = pagadoPorMembresia.get(memId) || 0;
    const precio = precioPorMembresia.get(memId) || 0;
    mapa.set(Number(pago.id), { pagado, saldo: precio - pagado });
  });

  return mapa;
};
