// =========================================================
// HOOK DE CHECKOUT DE PAGOS
// Registro de cobros nuevos y cancelación en curso.
// El estado del formulario vive en usePagoFormulario; la
// edición, en usePagoEdicion; la lógica pura, en utils.
// =========================================================

import { useState } from "react";
import { pagosService } from "../services/pagosService";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { ESTADO_PAGO } from "../utils/pagos";
import {
  motivosRechazoTarjeta,
  payloadAltaDesdeFormulario,
  resumenDatosLeidos,
  validarFormularioPago,
} from "../utils/pagosCheckout";
import { usePagoFormulario } from "./usePagoFormulario";
import { crearEdicionPago } from "./usePagoEdicion";

export function usePagosCheckout({
  onSesionExpirada,
  notificar: notificarOpciones,
  setErrorPagos,
  obtenerPagos,
  construirTicket,
}) {
  const [guardandoPago, setGuardandoPago] = useState(false);
  const [modalPago, setModalPago] = useState(null);
  const [ticketPago, setTicketPago] = useState(null);

  const formulario = usePagoFormulario();
  const { formPago } = formulario;

  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const notificar = (t) => notificarOpciones?.(t);
  const avisarError = (t) => setErrorPagos?.(t);

  const edicion = crearEdicionPago({
    formulario,
    ejecutar,
    notificar,
    avisarError,
    obtenerPagos,
    setGuardandoPago,
  });

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

    formulario.limpiarFormularioPago();

    if (Number(estado) === ESTADO_PAGO.RECHAZADO) {
      const motivos = motivosRechazoTarjeta(formPago);

      const detalle = [
        motivos.length
          ? `Revisá: ${motivos.join("; ")}.`
          : null,
        `Datos leídos → ${resumenDatosLeidos(formPago)}`,
      ]
        .filter(Boolean)
        .join(" ");

      setModalPago({
        type: "error",
        title: "Pago rechazado",
        message:
          "La operación no pudo acreditarse. " + detalle,
      });
      setTicketPago(null);
      notificar("Pago rechazado.");
    } else {
      setTicketPago(
        construirTicket?.({
          ...payload,
          id: resultado.datos?.id ?? Date.now(),
        }) ?? null
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

    notificar("Pago cancelado registrado.");
    formulario.limpiarFormularioPago();
    await obtenerPagos?.();
  };

  /** Reset total del dominio (al cerrar sesión). */
  const reiniciar = () => {
    setGuardandoPago(false);
    setModalPago(null);
    setTicketPago(null);
    formulario.limpiarFormularioPago();
  };

  return {
    ...formulario,

    guardandoPago,
    modalPago,
    setModalPago,
    ticketPago,
    setTicketPago,
    registrarPago,
    guardarPagoEditado: edicion.guardarPagoEdicion,
    cancelarRegistroPago,
    reiniciar,
  };
}
