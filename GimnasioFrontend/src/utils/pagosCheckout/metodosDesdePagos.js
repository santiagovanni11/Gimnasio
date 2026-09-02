// =========================================================
// DERIVACIÓN DE TARJETAS DESDE PAGOS
// Un socio que pagó con tarjeta (débito/crédito) deja la marca,
// los últimos 4 dígitos y el vencimiento en la referencia y las
// observaciones del pago. Esta utilidad los reconstruye para
// que esas tarjetas queden disponibles en la renovación
// automática, incluso para pagos anteriores al registro de
// métodos almacenados.
// =========================================================

import { FORMA_PAGO, ESTADO_PAGO } from "../pagos";
import { parseVencimiento } from "../tarjeta";

const esTarjeta = (pago) =>
  [FORMA_PAGO.DEBITO, FORMA_PAGO.CREDITO].includes(Number(pago.formaPago));

const esAprobado = (pago) => Number(pago.estado) === ESTADO_PAGO.APROBADO;

const ultimosCuatroDe = (referencia = "") => {
  const match = String(referencia).match(/\*{4}(\d{4})/);
  return match ? match[1] : "";
};

const marcaDe = (pago = {}) => {
  const enObs = String(pago.observaciones || "").match(/Marca:\s*([A-Za-z]+)/i);
  if (enObs) return enObs[1];
  const enRef = String(pago.referencia || "").trim().split(/[-|]/)[0]?.trim();
  return enRef || "";
};

const vencimientoDe = (pago = {}) => {
  const match = String(pago.observaciones || "").match(
    /Vencimiento:\s*(\d{2}\/\d{2})/
  );
  return match ? match[1] : "";
};

/**
 * Devuelve las tarjetas únicas derivadas de los pagos con tarjeta
 * aprobados del socio: [{ marca, ultimosCuatro, mesVencimiento, anioVencimiento }].
 */
export function metodosDesdePagos(pagos = []) {
  const unicas = new Map();

  (pagos || [])
    .filter(esTarjeta)
    .filter(esAprobado)
    .forEach((pago) => {
      const marca = marcaDe(pago);
      const ultimosCuatro = ultimosCuatroDe(pago.referencia);
      const venc = parseVencimiento(vencimientoDe(pago));

      if (!marca || ultimosCuatro.length !== 4 || !venc.valido) return;

      const clave = `${marca}-${ultimosCuatro}-${venc.mes}-${venc.anio}`;
      if (!unicas.has(clave)) {
        unicas.set(clave, {
          marca,
          ultimosCuatro,
          mesVencimiento: venc.mes,
          anioVencimiento: venc.anio,
        });
      }
    });

  return Array.from(unicas.values());
}
