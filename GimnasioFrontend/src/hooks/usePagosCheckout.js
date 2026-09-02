// =========================================================
// HOOK DE CHECKOUT DE PAGOS
// Orquesta el dominio de pagos: estado del formulario
// (usePagoFormulario), registro (crearRegistroPago) y
// edición (usePagoEdicion). La lógica pura vive en utils.
// =========================================================

import { useState } from "react";
import { crearEjecutorApi } from "../services/apiEjecutor";
import { usePagoFormulario } from "./usePagoFormulario";
import { crearEdicionPago } from "./usePagoEdicion";
import { crearRegistroPago } from "./crearRegistroPago";

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

  const registro = crearRegistroPago({
    formulario,
    ejecutar,
    notificar,
    avisarError,
    obtenerPagos,
    setGuardandoPago,
    setModalPago,
    setTicketPago,
    construirTicket,
  });

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
    registrarPago: registro.registrarPago,
    guardarPagoEditado: edicion.guardarPagoEdicion,
    cancelarRegistroPago: registro.cancelarRegistroPago,
    reiniciar,
  };
}
