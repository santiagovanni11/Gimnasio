// =========================================================
// RESUMEN DE PAGOS DE LA SECCIÓN
// Derivados memorizados: saldo por pago, total aprobado del
// período y morosos. Consumido por PagosSection.
// =========================================================

import { useMemo } from "react";
import {
  getMembresiasRechazadasIds,
  totalAprobadoDelPeriodoPorMembresia,
} from "../utils/pagosPeriodo";
import {
  calcularMorosos,
  calcularSaldoPorPago,
} from "../utils/saldosPagos";

export function useResumenPagos({ pagos, membresias }) {
  /** pagoId -> { pagado, saldo } del período vigente. */
  const saldoPorPago = useMemo(
    () => calcularSaldoPorPago(pagos, membresias),
    [pagos, membresias]
  );

  /** Mapa membresiaId -> total aprobado del período. */
  const pagadoPorMembresia = useMemo(
    () => totalAprobadoDelPeriodoPorMembresia(pagos, membresias),
    [pagos, membresias]
  );

  /** Membresías del período con rechazo y sin aprobado. */
  const rechazadasIds = useMemo(
    () => getMembresiasRechazadasIds(pagos, membresias),
    [pagos, membresias]
  );

  const morosos = useMemo(
    () =>
      calcularMorosos(
        membresias,
        pagadoPorMembresia,
        rechazadasIds
      ),
    [membresias, pagadoPorMembresia, rechazadasIds]
  );

  return { saldoPorPago, morosos };
}
