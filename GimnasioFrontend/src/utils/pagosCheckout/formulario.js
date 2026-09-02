// =========================================================
// FORMULARIO DE PAGO → PAYLOADS DEL API
// Validación común y construcción del payload de alta o
// edición a partir del estado del formulario.
// =========================================================

import { determinarEstadoAutomatico } from "./validacionesTarjeta";
import { crearDetallePago } from "./detallePago";

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
