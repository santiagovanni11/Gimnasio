// =========================================================
// HOOK DE PAGOS (FACHADA)
// Compone checkout + datos y expone el contrato completo.
// =========================================================

import { usePagosCheckout } from "./usePagosCheckout";
import { usePagosDatos } from "./usePagosDatos";

export function usePagos(opciones) {
  const {
    onSesionExpirada,
    notificar: notificarOpciones,
    construirTicket,
  } = opciones || {};

  const notificar = (texto) => notificarOpciones?.(texto);

  const datos = usePagosDatos({
    onSesionExpirada,
    notificar,
  });

  const checkout = usePagosCheckout({
    onSesionExpirada,
    notificar,
    setErrorPagos: datos.setErrorPagos,
    obtenerPagos: datos.obtenerPagos,
    construirTicket,
  });

  return {
    ...datos,
    ...checkout,

    /** Reset total del dominio (al cerrar sesión). */
    reiniciar: () => {
      datos.reiniciarDatos();
      checkout.reiniciar();
    },
  };
}
