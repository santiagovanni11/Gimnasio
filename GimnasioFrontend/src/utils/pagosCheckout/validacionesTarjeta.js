// =========================================================
// VALIDACIONES DE TARJETA DEL CHECKOUT
// Determinan si un pago con tarjeta se aprueba o rechaza y
// generan los motivos legibles para el usuario.
// =========================================================

import { FORMA_PAGO, ESTADO_PAGO } from "../pagos";
import { validarTarjeta, parseVencimiento, estaVencida } from "../tarjeta";

/**
 * Validación estricta: Luhn + prefijo BIN. Con false se usa
 * validacionTarjetaLigera (datos básicos sin Luhn).
 */
export const TARJETA_VALIDACION_STRICTA = false;

/**
 * Validación ligera: no exige Luhn ni prefijo de marca, solo
 * datos básicos (vencimiento vigente, titular, longitud, CVV).
 */
export const validacionTarjetaLigera = (formPago) => {
  const numero = String(formPago.numeroTarjeta || "").replace(/\D/g, "");
  const titular = String(formPago.titularTarjeta || "").trim();
  const cvv = String(formPago.cvvTarjeta || "").replace(/\D/g, "");
  const esAmex = String(formPago.marcaTarjeta || "").toLowerCase() === "amex";
  const venc = parseVencimiento(formPago.vencimientoTarjeta);

  const motivos = [];

  if (titular.length < 3) motivos.push("falta el titular (mínimo 3 caracteres)");
  if (!venc.valido) motivos.push("el vencimiento debe tener formato MM/AA");
  else if (estaVencida(formPago.vencimientoTarjeta)) motivos.push("la tarjeta está vencida");
  if (numero.length !== (esAmex ? 15 : 16)) motivos.push("la cantidad de dígitos no corresponde con la marca");
  if (cvv.length !== (esAmex ? 4 : 3)) motivos.push("el CVV es incorrecto para esta marca");

  return { esValida: motivos.length === 0, motivos };
};

/** Resumen de lo que el sistema leyó del formulario
 *  (para el modal de rechazo: soporte instantáneo). */
export const resumenDatosLeidos = (formPago) => {
  const numero = String(formPago.numeroTarjeta || "").replace(
    /\D/g,
    ""
  );

  const enmascarado = numero
    ? `${numero.slice(0, 6)}******${numero.slice(-4)} (${numero.length} dígitos)`
    : "(vacío)";

  return [
    `número: ${enmascarado}`,
    `titular: ${formPago.titularTarjeta?.trim() || "(vacío)"}`,
    `vencimiento: "${formPago.vencimientoTarjeta || ""}"`,
    `CVV: ${
      formPago.cvvTarjeta
        ? `${String(formPago.cvvTarjeta).length} dígitos`
        : "(vacío)"
    }`,
    `marca: ${formPago.marcaTarjeta || "-"}`,
  ].join(" · ");
};

/** Lista legible de motivos por los que la tarjeta falla. */
export const motivosRechazoTarjeta = (formPago) => {
  if (!TARJETA_VALIDACION_STRICTA) {
    return validacionTarjetaLigera(formPago).motivos;
  }

  const r = validarTarjeta({
    numeroTarjeta: formPago.numeroTarjeta,
    titular: formPago.titularTarjeta,
    vencimiento: formPago.vencimientoTarjeta,
    cvv: formPago.cvvTarjeta,
    marca: formPago.marcaTarjeta,
  });

  const motivos = [];
  if (!r.longitudOk) {
    motivos.push("la cantidad de dígitos no corresponde con la marca");
  }
  if (!r.titularOk) {
    motivos.push("falta el titular (mínimo 3 caracteres)");
  }
  if (!r.vencimientoValido) {
    motivos.push("el vencimiento debe tener formato MM/AA");
  }
  if (r.vencida) {
    motivos.push("la tarjeta está vencida");
  }
  if (!r.cvvOk) {
    motivos.push("el CVV es incorrecto para esta marca");
  }
  if (!r.luhnOk) {
    motivos.push("el número de tarjeta no es válido");
  }

  return motivos;
};

/** El estado se determina solo: efectivo aprueba; tarjeta
 *  depende de la validación elegida (estricta o ligera). */
export const determinarEstadoAutomatico = (formPago) => {
  const forma = Number(formPago.formaPago);

  if (
    forma !== FORMA_PAGO.DEBITO &&
    forma !== FORMA_PAGO.CREDITO
  ) {
    return ESTADO_PAGO.APROBADO;
  }

  if (!TARJETA_VALIDACION_STRICTA) {
    return validacionTarjetaLigera(formPago).esValida
      ? ESTADO_PAGO.APROBADO
      : ESTADO_PAGO.RECHAZADO;
  }

  const resultado = validarTarjeta({
    numeroTarjeta: formPago.numeroTarjeta,
    titular: formPago.titularTarjeta,
    vencimiento: formPago.vencimientoTarjeta,
    cvv: formPago.cvvTarjeta,
    marca: formPago.marcaTarjeta,
  });

  return resultado.esValida
    ? ESTADO_PAGO.APROBADO
    : ESTADO_PAGO.RECHAZADO;
};
