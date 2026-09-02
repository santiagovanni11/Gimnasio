// =========================================================
// PAGOS POR PERÍODO DE MEMBRESÍA
// Una membresía renovada conserva su historial; estos helpers
// limitan los cálculos de rechazo/saldo a los pagos del
// período vigente (desde el sello UltimaRenovacion).
// Sin sello (membresías previas), cuentan todos los pagos.
// =========================================================

import { ESTADO_PAGO } from "./pagos";
import { aISO } from "./fechas";

/**
 * Sello del período como día calendario local (yyyy-mm-dd),
 * o null si la membresía no tiene.
 */
const selloDe = (membresia) => {
  const sello = membresia?.ultimaRenovacion;
  if (!sello) return null;

  const fecha = new Date(sello);
  return Number.isNaN(fecha.getTime()) ? null : aISO(fecha);
};

/** Día calendario (yyyy-mm-dd) de una fecha, en horario local. */
const diaDe = (valor) => {
  const texto = String(valor || "");

  // Fecha sin hora ("2026-08-22" o "...T00:00:00"): representa
  // un día calendario, no un instante; se usa tal cual.
  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto.slice(0, 10);

  const fecha = new Date(texto);
  return Number.isNaN(fecha.getTime()) ? "" : aISO(fecha);
};

/**
 * ¿El pago entra en la ventana del sello? Se compara por DÍA
 * calendario: los pagos se registran con fecha sin hora y el
 * sello guarda la hora exacta del alta/renovación, así que un
 * cobro hecho el mismo día pertenece al período vigente.
 * Sin sello, el pago cuenta.
 */
const pagoEnPeriodo = (pago, sello) =>
  sello === null ||
  diaDe(pago.fechaPago) >= sello;

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
 * IDs de membresías rechazadas: una membresía queda rechazada
 * solo cuando el último intento de cobro del período actual
 * está rechazado. Si después se aprueba, se limpia sola.
 */
export const getMembresiasRechazadasIds = (pagos = [], membresias = []) => {
  const ids = new Set();
  const sellos = new Map(
    (membresias ?? []).map((m) => [Number(m.id), selloDe(m)])
  );

  const pagosPorMembresia = new Map();
  (pagos ?? []).forEach((pago, index) => {
    const id = Number(pago.membresiaId);
    if (!Number.isFinite(id)) return;
    if (!pagoEnPeriodo(pago, sellos.get(id))) return;

    const items = pagosPorMembresia.get(id) ?? [];
    items.push({ ...pago, __index: index });
    pagosPorMembresia.set(id, items);
  });

  pagosPorMembresia.forEach((items, id) => {
    const ultimo = [...items].sort((a, b) => {
      const fechaA = new Date(a.fechaPago || 0).getTime();
      const fechaB = new Date(b.fechaPago || 0).getTime();
      if (fechaB !== fechaA) return fechaB - fechaA;
      return Number(b.__index) - Number(a.__index);
    })[0];

    if (Number(ultimo?.estado) === ESTADO_PAGO.RECHAZADO) {
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
