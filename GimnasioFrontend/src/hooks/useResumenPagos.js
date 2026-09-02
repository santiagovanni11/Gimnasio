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
import { calcularSaldoPorPago } from "../utils/saldosPagos";
import {
  ESTADO_MEMBRESIA,
  getMembresiasConSaldoPendiente,
} from "../utils/membresias";
import { diasParaVencer } from "../utils/vencimientosMembresia";

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
      getMembresiasConSaldoPendiente(
        membresias,
        pagadoPorMembresia,
        rechazadasIds
      ),
    [membresias, pagadoPorMembresia, rechazadasIds]
  );

  /** Activas que vencen hoy (0) o mañana (1). */
  const porVencer = useMemo(
    () =>
      membresias
        .filter(
          (m) =>
            Number(m.estado) === ESTADO_MEMBRESIA.ACTIVA &&
            [0, 1].includes(diasParaVencer(m.fechaFin))
        )
        .sort((a, b) => diasParaVencer(a.fechaFin) - diasParaVencer(b.fechaFin)),
    [membresias]
  );

  return { saldoPorPago, morosos, porVencer };
}
