// =========================================================
// RENOVACIÓN RÁPIDA DE MEMBRESÍA
// Un clic sobre una membresía vencida/por vencer: renueva con
// el mismo socio, plan y duración (sin abrir el formulario) y
// ofrece registrar el cobro en el momento. Si la duración
// anterior no es un escalón estándar o falta el precio,
// delega en el flujo clásico del formulario.
// =========================================================

import { obtenerNombre, obtenerApellido } from "../services/almacenSesion";
import { dialogoSistema } from "../services/servicioDialogos";
import { membresiasService } from "../services/membresiasService";
import { sumarMesesIso } from "../utils/membresias";
import { aISO, fechaDesdeValor } from "../utils/fechas";
import { registrarRenovacionMembresia } from "../utils/membresiasMetadata";
import {
  resolverDatosRenovacion,
  mensajeConfirmarRenovacion,
} from "../utils/renovacionRapida";

export function crearRenovacionRapida({
  ejecutar,
  notificar,
  avisarError,
  obtenerMembresias,
  getPlanes,
  obtenerPrecioSegunDuracion,
  abrirFormularioRenovacion,
  alRenovada,
}) {
  const renovarEnServidor = async ({ membresia, meses, precio }) => {
    const fechaInicio = aISO(fechaDesdeValor(membresia.fechaFin));

    const payload = {
      id: membresia.id,
      socioId: Number(membresia.socioId),
      planId: Number(membresia.planId),
      fechaInicio,
      fechaFin: sumarMesesIso(fechaInicio, meses),
      precioAplicado: precio,
      estado: Number(membresia.estado ?? 1),
    };

    return ejecutar({
      peticion: () =>
        membresiasService.actualizarMembresia(
          membresia.id,
          payload,
          true // renovación: sella un período de cobro nuevo
        ),
      onError: avisarError,
      mensajePermiso: "No tenés permisos para modificar membresías.",
      mensajeError: "No se pudo renovar la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al renovar membresía:",
    });
  };

  /**
   * Renovación en un paso. Resuelve false si se abrió el
   * formulario clásico o falló el guardado.
   */
  const renovarRapido = async (membresia) => {
    if (!membresia) return false;
    const usuario = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";

    const datosRenovacion = resolverDatosRenovacion(
      membresia,
      getPlanes,
      obtenerPrecioSegunDuracion
    );

    // Sin duración estándar o sin precio → formulario clásico.
    if (!datosRenovacion) {
      abrirFormularioRenovacion?.(membresia);
      return false;
    }

    const acepta = await dialogoSistema.confirmar({
      titulo: "Renovar membresía",
      mensaje: mensajeConfirmarRenovacion({
        membresia,
        ...datosRenovacion,
      }),
      textoAceptar: "Renovar",
      textoCancelar: "Otra duración…",
    });

    if (!acepta) {
      abrirFormularioRenovacion?.(membresia);
      return false;
    }

    const resultado = await renovarEnServidor({
      membresia,
      ...datosRenovacion,
    });

    if (!resultado) return false;

    registrarRenovacionMembresia(
      {
        ...membresia,
        fechaInicio: aISO(fechaDesdeValor(membresia.fechaFin)),
        fechaFin: sumarMesesIso(aISO(fechaDesdeValor(membresia.fechaFin)), datosRenovacion.meses),
        precioAplicado: datosRenovacion.precio,
        planNombre: (getPlanes?.() ?? []).find((plan) => Number(plan.id) === Number(membresia.planId))?.nombre || membresia.planNombre,
      },
      usuario
    );

    notificar("Membresía renovada correctamente.");
    await obtenerMembresias?.();

    const cobraAhora = await dialogoSistema.confirmar({
      titulo: "Registrar pago",
      mensaje: "¿Registrás el cobro de esta renovación ahora?",
      textoAceptar: "Ir a cobrar",
      textoCancelar: "Después",
    });

    if (cobraAhora) alRenovada?.(membresia.id, datosRenovacion.precio);

    return true;
  };

  return { renovarRapido };
}
