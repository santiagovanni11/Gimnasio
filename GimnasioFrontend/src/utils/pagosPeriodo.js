// =========================================================
// PAGOS POR PERÍODO DE MEMBRESÍA
// Una membresía renovada conserva su historial; estos helpers
// limitan los cálculos de rechazo/saldo a los pagos del
// período vigente (desde el sello UltimaRenovacion).
// Sin sello (membresías previas), cuentan todos los pagos.
// =========================================================

import { ESTADO_PAGO } from "./pagos";

/** Timestamp del sello, o null si la membresía no tiene. */
const selloDe = (membresia) => {
  const sello = membresia?.ultimaRenovacion;
  return sello ? new Date(sello).getTime() : null;
};

/** ¿El pago entra en la ventana del sello? Sin sello, sí. */
const pagoEnPeriodo = (pago, sello) =>
  sello === null ||
  !pago.fechaPago ||
  new Date(pago.fechaPago).getTime() >= sello;

/** Mapa membresiaId -> { aprobados, rechazados } del período. */
export const conteoPagosPorPeriodo = (pagos = [], membresias = []) => {
  const sellos = new Map(
    (membresias ?? []).map((m) => [Number(m.id), selloDe(m)])
  );

  const conteo = new Map();

  pagos.forEach((pago) => {
    const id = Number(pago.membresiaId);
    if (!Number.isFinite(id)) return;

    if (!pagoEnPeriodo(pago, sellos.get(id))) return;

    const fila = conteo.get(id) ?? { aprobados: 0, rechazados: 0 };

    if (Number(pago.estado) === ESTADO_PAGO.APROBADO) {
      fila.aprobados += 1;
    } else if (Number(pago.estado) === ESTADO_PAGO.RECHAZADO) {
      fila.rechazados += 1;
    }

    conteo.set(id, fila);
  });

  return conteo;
};

/**
 * IDs de membresías rechazadas: con al menos un pago
 * RECHAZADO del período y ningún APROBADO en él.
 */
export const getMembresiasRechazadasIds = (pagos = [], membresias = []) => {
  const conteo = conteoPagosPorPeriodo(pagos, membresias);

  const ids = new Set();

  conteo.forEach((fila, id) => {
    if (fila.rechazados > 0 && fila.aprobados === 0) {
      ids.add(id);
    }
  });

  return ids;
};

/**
 * Mapa membresiaId -> total APROBADO del período actual.
 * Es la base del saldo pendiente tras una renovación.
 */
export const totalAprobadoDelPeriodoPorMembresia = (
  pagos = [],
  membresias = []
) => {
  const sellos = new Map(
    (membresias ?? []).map((m) => [Number(m.id), selloDe(m)])
  );

  const mapa = new Map();

  pagos.forEach((pago) => {
    if (Number(pago.estado) !== ESTADO_PAGO.APROBADO) return;

    const id = Number(pago.membresiaId);
    if (!Number.isFinite(id)) return;
    if (!pagoEnPeriodo(pago, sellos.get(id))) return;

    mapa.set(id, (mapa.get(id) || 0) + Number(pago.monto || 0));
  });

  return mapa;
};
