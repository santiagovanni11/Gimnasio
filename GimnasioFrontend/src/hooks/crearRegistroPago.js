// =========================================================
// REGISTRO DE COBROS
// Fábrica que inyecta formulario, ejecutor y callbacks;
// expone registrarPago y cancelarRegistroPago listos para
// el checkout. La edición vive en usePagoEdicion.
// =========================================================

import { pagosService } from "../services/pagosService";
import { ESTADO_PAGO } from "../utils/pagos";
import {
  motivosRechazoTarjeta,
  payloadAltaDesdeFormulario,
  resumenDatosLeidos,
  validarFormularioPago,
} from "../utils/pagosCheckout";
import { registrarEventoPago } from "../utils/pagosMetadata";

/** Mensaje del modal cuando la operación sale rechazada. */
const mensajeRechazo = (formPago) => {
  const motivos = motivosRechazoTarjeta(formPago);

  const detalle = [
    motivos.length ? `Revisá: ${motivos.join("; ")}.` : null,
    `Datos leídos → ${resumenDatosLeidos(formPago)}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    "La operación no pudo acreditarse. " + detalle
  );
};

export function crearRegistroPago({
  formulario,
  ejecutar,
  notificar,
  avisarError,
  obtenerPagos,
  setGuardandoPago,
  setModalPago,
  setTicketPago,
  construirTicket,
}) {
  const { formPago } = formulario;

  /** Registra el cobro; según la tarjeta puede salir rechazado. */
  const registrarPago = async (event) => {
    event.preventDefault();
    setGuardandoPago(true);

    const errorValidacion = validarFormularioPago(formPago);

    if (errorValidacion) {
      avisarError(errorValidacion);
      setGuardandoPago(false);
      return;
    }

    const { payload, estado } =
      payloadAltaDesdeFormulario(formPago, formulario._fechaHoy);

    const resultado = await ejecutar({
      peticion: () => pagosService.crearPago(payload),
      onError: avisarError,
      mensajePermiso: "No tenés permisos para registrar pagos.",
      mensajeError: "No se pudo registrar el pago.",
      mensajeRed:
        "No se pudo conectar con la API para registrar el pago.",
      etiquetaLog: "Error al registrar pago:",
    });

    setGuardandoPago(false);

    if (!resultado) return;

    const pagoRegistrado = {
      ...payload,
      id: resultado.datos?.id ?? Date.now(),
    };

    formulario.limpiarFormularioPago();

    if (Number(estado) === ESTADO_PAGO.RECHAZADO) {
      registrarEventoPago(
        pagoRegistrado,
        "Rechazo",
        mensajeRechazo(formPago),
        "Sistema"
      );
      setModalPago({
        type: "error",
        title: "Pago rechazado",
        message: mensajeRechazo(formPago),
      });
      setTicketPago(null);
      notificar("Pago rechazado.");
    } else {
      registrarEventoPago(
        pagoRegistrado,
        "Aprobación",
        "Cobro registrado y acreditado.",
        "Sistema"
      );
      setTicketPago(
        construirTicket?.(pagoRegistrado) ?? null
      );
      setModalPago(null);
      notificar("Pago registrado correctamente.");
    }

    await obtenerPagos?.();
  };

  /** Cancela el cobro en curso registrándolo como CANCELADO. */
  const cancelarRegistroPago = async () => {
    const monto = Number(formPago.monto);

    if (
      !formPago.membresiaId ||
      !Number.isFinite(monto) ||
      monto <= 0
    ) {
      formulario.limpiarFormularioPago();
      return;
    }

    const base =
      payloadAltaDesdeFormulario(formPago, formulario._fechaHoy)
        .payload;

    const resultado = await ejecutar({
      peticion: () =>
        pagosService.crearPago({
          ...base,
          estado: ESTADO_PAGO.CANCELADO,
          observaciones:
            base.observaciones || "Pago cancelado por el operador",
        }),
      onError: avisarError,
      mensajePermiso: "No tenés permisos para registrar pagos.",
      mensajeError: "No se pudo registrar el pago cancelado.",
      mensajeRed:
        "No se pudo conectar con la API para cancelar el pago.",
      etiquetaLog: "Error al cancelar pago:",
    });

    if (!resultado) return;

    registrarEventoPago(
      {
        ...base,
        id: resultado.datos?.id ?? Date.now(),
      },
      "Cancelación",
      "Pago cancelado por el operador.",
      "Sistema"
    );
    notificar("Pago cancelado registrado.");
    formulario.limpiarFormularioPago();
    await obtenerPagos?.();
  };

  return { registrarPago, cancelarRegistroPago };
}
