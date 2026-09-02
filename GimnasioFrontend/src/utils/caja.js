// =========================================================
// CIERRE DE CAJA — CÁLCULOS
// Agregación de cobros aprobados por forma de pago, para un
// día o para un rango. La exportación a PDF vive en cajaPdf.
// =========================================================

import {
  FORMA_PAGO,
  formaPagoTexto,
  esAprobado,
  soloValidos,
} from "./pagos";

/** Pagos aprobados cuya fecha cae entre dos ISO (inclusive). */
export const pagosEntreFechas = (
  pagos = [],
  desdeISO,
  hastaISO
) =>
  soloValidos(pagos).filter((pago) => {
    const dia = (pago.fechaPago || "").slice(0, 10);

    return (
      esAprobado(pago) && dia >= desdeISO && dia <= hastaISO
    );
  });

/** Sumariza pagos por forma de pago (solo con movimiento). */
const agregarPorForma = (pagos = []) =>
  Object.values(FORMA_PAGO)
    .map((forma) => {
      const items = pagos.filter(
        (pago) => Number(pago.formaPago) === forma
      );

      return {
        forma,
        nombre: formaPagoTexto(forma),
        cantidad: items.length,
        monto: items.reduce(
          (total, pago) => total + Number(pago.monto || 0),
          0
        ),
      };
    })
    .filter((item) => item.cantidad > 0);

const totalizar = (pagos = []) =>
  pagos.reduce((total, pago) => total + Number(pago.monto || 0), 0);

/**
 * Cierre de un día (ISO yyyy-mm-dd).
 * Shape: { fecha, formas, cantidad, total }.
 */
export const calcularCierreCaja = (pagos = [], fechaISO) => {
  const delDia = pagosEntreFechas(pagos, fechaISO, fechaISO);

  return {
    fecha: fechaISO,
    formas: agregarPorForma(delDia),
    cantidad: delDia.length,
    total: totalizar(delDia),
  };
};

/**
 * Cierre de un rango inclusivo (dos ISO).
 * Shape: { desde, hasta, formas, cantidad, total }.
 */
export const calcularCierreRango = (
  pagos = [],
  desdeISO,
  hastaISO
) => {
  const delRango = pagosEntreFechas(pagos, desdeISO, hastaISO);

  return {
    desde: desdeISO,
    hasta: hastaISO,
    formas: agregarPorForma(delRango),
    cantidad: delRango.length,
    total: totalizar(delRango),
  };
};
