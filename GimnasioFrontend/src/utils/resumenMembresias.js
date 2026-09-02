// =========================================================
// RESUMEN Y RECUPERACIÓN DE MEMBRESÍAS
// Conteos por estado para las tarjetas y la ventana de
// recuperación de vencidas recientes.
// =========================================================

import { ESTADO_MEMBRESIA } from "./membresias";
import { diasParaVencer } from "./vencimientosMembresia";

/**
 * Estado de salud de la base:
 * activas, activas por vencer (7 días), vencidas y suspendidas.
 */
export const calcularResumenMembresias = (membresias = []) => {
  const resumen = {
    activas: 0,
    porVencer: 0,
    vencidas: 0,
    suspendidas: 0,
  };

  membresias.forEach((m) => {
    const estado = Number(m.estado);

    if (estado === ESTADO_MEMBRESIA.ACTIVA) {
      resumen.activas += 1;

      if (diasParaVencer(m.fechaFin) <= 7) {
        resumen.porVencer += 1;
      }

      return;
    }

    if (estado === ESTADO_MEMBRESIA.VENCIDA) {
      resumen.vencidas += 1;
    } else if (estado === ESTADO_MEMBRESIA.SUSPENDIDA) {
      resumen.suspendidas += 1;
    }
  });

  return resumen;
};

/**
 * Vencidas dentro de los últimos N días, la más reciente
 * primero. Base del panel de recuperación: llamar antes de
 * que el vínculo se enfríe.
 */
export const vencidasRecientes = (
  membresias = [],
  diasVentana = 30
) =>
  membresias
    .filter((m) => {
      if (Number(m.estado) !== ESTADO_MEMBRESIA.VENCIDA) {
        return false;
      }

      const haceDias = -diasParaVencer(m.fechaFin);

      return haceDias >= 0 && haceDias <= diasVentana;
    })
    .sort(
      (a, b) =>
        diasParaVencer(b.fechaFin) - diasParaVencer(a.fechaFin)
    );
