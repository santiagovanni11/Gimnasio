// =========================================================
// LÓGICA DE NEGOCIO DEL CHECKOUT DE PAGOS
// Estado automático según forma de pago, detalle de tarjeta
// y validaciones previas al registro.
// =========================================================

import { FORMA_PAGO, ESTADO_PAGO } from "./pagos";
import { validarTarjeta, parseVencimiento, estaVencida } from "./tarjeta";

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

/** Arma el payload de alta a partir del formulario. */
export const payloadAltaDesdeFormulario = (
  formPago,
  fechaPorDefecto
) => {
  const estado = determinarEstadoAutomatico(formPago);
  const detalle = crearDetallePago(formPago);

  return {
    payload: {
      membresiaId: Number(formPago.membresiaId),
      monto: Number(formPago.monto),
      formaPago: Number(formPago.formaPago),
      estado,
      fechaPago: formPago.fechaPago || fechaPorDefecto(),
      referencia: detalle.referencia || null,
      observaciones: detalle.observaciones || null,
    },
    estado,
  };
};

/** Arma el payload de edición conservando el estado elegido. */
export const payloadEdicionDesdeFormulario = (
  formPago,
  pagoEditando,
  fechaPorDefecto
) => ({
  id: Number(pagoEditando.id),
  membresiaId: Number(formPago.membresiaId),
  monto: Number(formPago.monto),
  formaPago: Number(formPago.formaPago),
  estado: Number(formPago.estado ?? 2),
  fechaPago: formPago.fechaPago || fechaPorDefecto(),
  referencia: formPago.referencia?.trim() || null,
  observaciones: formPago.observaciones?.trim() || null,
});
