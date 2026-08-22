// =========================================================
// GUARDADO DE EDICIÓN DE PAGO
// Fábrica que inyecta formulario, ejecutor y callbacks;
// expone guardarPagoEdicion listo para el checkout.
// =========================================================

import { pagosService } from "../services/pagosService";
import {
  payloadEdicionDesdeFormulario,
  validarFormularioPago,
} from "../utils/pagosCheckout";

export function crearEdicionPago({
  formulario,
  ejecutar,
  notificar,
  avisarError,
  obtenerPagos,
  setGuardandoPago,
}) {
  const { formPago, pagoEditando } = formulario;

  /** Guarda los cambios del pago en edición. */
  async function guardarPagoEditado(event) {
    event.preventDefault();

    if (!pagoEditando) return;

    setGuardandoPago?.(true);

    const errorValidacion = validarFormularioPago(formPago);

    if (errorValidacion) {
      avisarError(errorValidacion);
      setGuardandoPago?.(false);
      return;
    }

    const payload = payloadEdicionDesdeFormulario(
      formPago,
      pagoEditando,
      formulario._fechaHoy
    );

    const resultado = await ejecutar({
      peticion: () =>
        pagosService.actualizarPago(pagoEditando.id, payload),
      onError: avisarError,
      mensajePermiso: "No tenés permisos para modificar pagos.",
      mensajeError: "No se pudo actualizar el pago.",
      mensajeRed:
        "No se pudo conectar con la API para actualizar el pago.",
      etiquetaLog: "Error al actualizar pago:",
    });

    setGuardandoPago?.(false);

    if (!resultado) return;

    notificar("Pago actualizado correctamente.");
    formulario.cancelarEdicionPago();
    await obtenerPagos?.();
  }

  return { guardarPagoEdicion: guardarPagoEditado };;
}
