// =========================================================
// VALIDACIONES DEL CHECKOUT
// Validación ligera de tarjeta (sin Luhn ni prefijo BIN),
// motivos legibles de rechazo y validación del formulario.
// =========================================================

import { parseVencimiento, estaVencida, validarTarjeta } from "../tarjeta";

/** Modo estricto (Luhn + BIN). Con false se usa la ligera. */
export const TARJETA_VALIDACION_STRICTA = false;

/**
 * Validación ligera: solo datos básicos — vencimiento vigente,
 * titular, longitud según marca y CVV. No exige Luhn ni BIN.
 */
export const validacionTarjetaLigera = (formPago) => {
  const numero = String(formPago.numeroTarjeta || "").replace(/\D/g, "");
  const titular = String(formPago.titularTarjeta || "").trim();
  const cvv = String(formPago.cvvTarjeta || "").replace(/\D/g, "");
  const esAmex = String(formPago.marcaTarjeta || "").toLowerCase() === "amex";
  const venc = parseVencimiento(formPago.vencimientoTarjeta);

  const motivos = [];

  if (titular.length < 3) {
    motivos.push("falta el titular (mínimo 3 caracteres)");
  }

  if (!venc.valido) {
    motivos.push("el vencimiento debe tener formato MM/AA");
  } else if (estaVencida(formPago.vencimientoTarjeta)) {
    motivos.push("la tarjeta está vencida");
  }

  if (numero.length !== (esAmex ? 15 : 16)) {
    motivos.push("la cantidad de dígitos no corresponde con la marca");
  }

  if (cvv.length !== (esAmex ? 4 : 3)) {
    motivos.push("el CVV es incorrecto para esta marca");
  }

  return { esValida: motivos.length === 0, motivos };
};

/** Motivos legibles para el modal de rechazo. */
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

/** Resumen de lo que el sistema leyó del formulario. */
export const resumenDatosLeidos = (formPago) => {
  const numero = String(formPago.numeroTarjeta || "").replace(/\D/g, "");
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

/** Validación común antes de registrar/guardar un pago. */
export const validarFormularioPago = (formPago) => {
  if (!formPago.membresiaId) {
    return "Debés seleccionar una membresía.";
  }

  const monto = Number(formPago.monto);
  if (!Number.isFinite(monto) || monto <= 0) {
    return "El monto debe ser mayor a cero.";
  }

  return "";
};