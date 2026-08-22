// =========================================================
// GUARDADO DE MEMBRESÍA
// Validación de selección, armado del payload y alta o
// actualización según exista membresía en edición.
// =========================================================

import { membresiasService } from "../services/membresiasService";
import { precioSegunDuracion } from "../utils/planes";

/** Validaciones previas al guardado. */
function validarSeleccion(f) {
  if (!f.socioSeleccionado) return "Debés seleccionar un socio.";
  if (!f.planSeleccionado) return "Debés seleccionar un plan.";
  if (!f.duracionMembresia) {
    return "Debés seleccionar una duración.";
  }
  if (!f.fechaInicioMembresia || !f.fechaFinMembresia) {
    return "No se pudieron calcular las fechas de la membresía.";
  }
  return "";
}

export function crearGuardadoMembresia({
  formulario,
  datos,
  ejecutar,
  notificar,
  getPlanes,
  obtenerPrecioSegunDuracion,
  alMembresiaCreada,
}) {
  return async function guardarMembresia() {
    const errorValidacion = validarSeleccion(formulario);

    if (errorValidacion) {
      datos.setErrorMembresias(errorValidacion);
      return;
    }

    const planActual = (getPlanes?.() ?? []).find(
      (plan) => Number(plan.id) === Number(formulario.planSeleccionado)
    );

    const calcularPrecio =
      obtenerPrecioSegunDuracion ??
      ((plan, duracion) => precioSegunDuracion(plan, duracion));

    const precioAplicado = calcularPrecio(
      planActual,
      formulario.duracionMembresia
    );

    const editando = Boolean(formulario.membresiaEditando);

    const payload = construirPayload(
      formulario,
      precioAplicado,
      editando
    );

    const peticion = editando
      ? () =>
          membresiasService.actualizarMembresia(
            formulario.membresiaEditando.id,
            payload,
            // Renovación: sella un período de cobro nuevo.
            formulario.modoRenovacion === true
          )
      : () => membresiasService.crearMembresia(payload);

    const resultado = await ejecutar({
      peticion,
      onError: datos.setErrorMembresias,
      mensajePermiso: editando
        ? "No tenés permisos para modificar membresías."
        : "No tenés permisos para crear membresías.",
      mensajeError: editando
        ? "No se pudo actualizar la membresía."
        : "No se pudo crear la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al guardar membresía:",
    });

    if (!resultado) return;

    const nuevaId = resultado.datos?.id ?? null;

    notificar(
      formulario.modoRenovacion
        ? "Membresía renovada correctamente."
        : editando
        ? "Membresía actualizada correctamente."
        : "Membresía creada correctamente."
    );

    await datos.obtenerMembresias();
    formulario.cerrarFormularioMembresia();

    if (!editando && nuevaId) {
      // Alta nueva: salta a Pagos para el cobro inicial.
      alMembresiaCreada?.(nuevaId, precioAplicado);
    } else if (formulario.modoRenovacion) {
      // Renovación: mismo salto, cobrando la renovación.
      alMembresiaCreada?.(
        formulario.membresiaEditando.id,
        precioAplicado
      );
    }
  };
}

function construirPayload(formulario, precioAplicado, editando) {
  return {
    ...(editando ? { id: formulario.membresiaEditando.id } : {}),
    socioId: Number(formulario.socioSeleccionado),
    planId: Number(formulario.planSeleccionado),
    fechaInicio: formulario.fechaInicioMembresia,
    fechaFin: formulario.fechaFinMembresia,
    precioAplicado,
    estado: editando
      ? Number(formulario.membresiaEditando.estado ?? 1)
      : 1,
  };
}
