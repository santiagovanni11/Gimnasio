// =========================================================
// DETALLE DEL PAGO (referencia y observaciones)
// Construye los campos de auditoría del pago según la
// forma de pago elegida.
// =========================================================

import { FORMA_PAGO } from "../pagos";

/** Construye referencia/observaciones para pagos con tarjeta. */
const detalleTarjeta = (formPago) => {
  const numero = (formPago.numeroTarjeta || "").replace(/\D/g, "");
  const numeroMask = numero ? `**** ${numero.slice(-4)}` : "";

  const marca = formPago.marcaTarjeta || "Tarjeta";
  const titular = formPago.titularTarjeta?.trim();
  const vencimiento = formPago.vencimientoTarjeta?.trim();

  const referencia = titular
    ? `${marca} - ${titular} - ${numeroMask || "sin tarjeta"}`
    : `${marca} - ${numeroMask || "sin tarjeta"}`;

  const observaciones =
    [
      titular ? `Titular: ${titular}` : null,
      vencimiento ? `Vencimiento: ${vencimiento}` : null,
      `Marca: ${marca}`,
    ]
      .filter(Boolean)
      .join(" | ") || "Pago con tarjeta";

  return { referencia, observaciones };
};

/** Referencia/observaciones según la forma de pago. */
export const crearDetallePago = (formPago) => {
  const forma = Number(formPago.formaPago);

  if (forma === FORMA_PAGO.DEBITO || forma === FORMA_PAGO.CREDITO) {
    return detalleTarjeta(formPago);
  }

  return {
    referencia: formPago.referencia?.trim() || null,
    observaciones: formPago.observaciones?.trim() || null,
  };
};
