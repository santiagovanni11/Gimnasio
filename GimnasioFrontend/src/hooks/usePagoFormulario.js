// =========================================================
// HOOK DE FORMULARIO DE PAGO
// Estado puro del formulario de cobro y sus transiciones.
// =========================================================

import { useState } from "react";
import { hoyISO } from "../utils/fechas";
import { FORMA_PAGO } from "../utils/pagos";
import { datosTarjetaDesdePago } from "../utils/pagosCheckout/datosTarjetaDesdePago";

const FECHA_HOY = () => hoyISO();

const TARJETA_VACIA = {
  titularTarjeta: "",
  numeroTarjeta: "",
  vencimientoTarjeta: "",
  cvvTarjeta: "",
  marcaTarjeta: "Visa",
};

const FORM_INICIAL = () => ({
  membresiaId: "",
  monto: "",
  formaPago: "1",
  estado: "2",
  fechaPago: FECHA_HOY(),
  referencia: "",
  observaciones: "",
  ...TARJETA_VACIA,
});

const esPagoTarjeta = (pago) =>
  [FORMA_PAGO.DEBITO, FORMA_PAGO.CREDITO].includes(Number(pago?.formaPago));

export function usePagoFormulario() {
  const [formPago, setFormPago] = useState(FORM_INICIAL);
  const [pagoEditando, setPagoEditando] = useState(null);

  const limpiarFormularioPago = () => setFormPago(FORM_INICIAL());

  /** Carga un pago existente para edición. */
  const editarPago = (pago) => {
    setPagoEditando(pago);
    setFormPago({
      membresiaId: String(pago.membresiaId ?? ""),
      monto: String(pago.monto ?? ""),
      formaPago: String(pago.formaPago ?? "1"),
      estado: String(pago.estado ?? "2"),
      fechaPago: pago.fechaPago
        ? pago.fechaPago.slice(0, 10)
        : FECHA_HOY(),
      referencia: pago.referencia || "",
      observaciones: pago.observaciones || "",
      ...TARJETA_VACIA,
      ...(esPagoTarjeta(pago) ? datosTarjetaDesdePago(pago) : {}),
    });
  };

  const cancelarEdicionPago = () => {
    setPagoEditando(null);
    limpiarFormularioPago();
  };

  /** Precarga el cobro al crear una membresía nueva. */
  const prefillPago = (membresiaId, monto) => {
    setFormPago((prev) => ({
      ...prev,
      membresiaId: String(membresiaId),
      monto: String(monto),
      formaPago: "1",
      estado: "2",
    }));
  };

  return {
    formPago,
    setFormPago,
    pagoEditando,
    limpiarFormularioPago,
    editarPago,
    cancelarEdicionPago,
    prefillPago,
    _fechaHoy: FECHA_HOY,
  };
}
