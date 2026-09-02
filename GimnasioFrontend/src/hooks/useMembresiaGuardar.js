// =========================================================
// GUARDADO DE MEMBRESÍA
// Validación de selección, armado del payload y alta o
// actualización según exista membresía en edición.
// =========================================================

import { obtenerNombre, obtenerApellido } from "../services/almacenSesion";
import { membresiasService } from "../services/membresiasService";
import { registrarEventoMembresia, registrarRenovacionMembresia } from "../utils/membresiasMetadata";
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
  if (f.renovacionAutomatica && !f.metodoPagoAlmacenadoId) {
    return "Para activar la renovación automática debés cargar un método de pago.";
  }
  return "";
}

export function crearGuardadoMembresia({
  getFormulario,
  datos,
  ejecutar,
  notificar,
  getPlanes,
  obtenerPrecioSegunDuracion,
  alMembresiaCreada,
}) {
  return async function guardarMembresia() {
    const formulario = getFormulario();
    const usuario = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";
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
    const idGuardado = Number(nuevaId ?? formulario.membresiaEditando?.id ?? 0);

    if (formulario.modoRenovacion) {
      registrarRenovacionMembresia(
        { ...formulario.membresiaEditando, ...payload, planNombre: (getPlanes?.() ?? []).find((plan) => Number(plan.id) === Number(formulario.planSeleccionado))?.nombre || formulario.membresiaEditando?.planNombre },
        usuario
      );
    } else if (editando && idGuardado) {
      registrarEventoMembresia(idGuardado, "Cambio de plan o fecha", `Plan: ${formulario.planSeleccionado} · inicio ${formulario.fechaInicioMembresia} · fin ${formulario.fechaFinMembresia}`, usuario);
    } else if (idGuardado) {
      registrarEventoMembresia(idGuardado, "Alta de membresía", `Plan: ${formulario.planSeleccionado} · ${formulario.fechaInicioMembresia} → ${formulario.fechaFinMembresia}`, usuario);
    }

    notificar(
      formulario.modoRenovacion
        ? "Membresía renovada correctamente."
        : editando
        ? "Membresía actualizada correctamente."
        : "Membresía creada correctamente."
    );

    await datos.obtenerMembresias();
    formulario.cerrarFormularioMembresia();

    // El precio a cobrar es siempre el que el backend realmente
    // persistió (recalculado por fechas), evitando discrepancias
    // entre el cálculo del frontend y el del backend.
    const precioBackend = resultado.datos?.precioAplicado;
    const precioCobrado =
      precioBackend > 0 ? precioBackend : precioAplicado;

    if (!editando && nuevaId) {
      alMembresiaCreada?.(nuevaId, precioCobrado);
    } else if (formulario.modoRenovacion) {
      alMembresiaCreada?.(
        formulario.membresiaEditando.id,
        precioCobrado
      );
    }
  };
}

function construirPayload(formulario, precioAplicado, editando) {
  const payload = {
    ...(editando ? { id: formulario.membresiaEditando.id } : {}),
    socioId: Number(formulario.socioSeleccionado),
    planId: Number(formulario.planSeleccionado),
    fechaInicio: formulario.fechaInicioMembresia,
    fechaFin: formulario.fechaFinMembresia,
    precioAplicado,
    estado: editando
      ? Number(formulario.membresiaEditando.estado ?? 1)
      : 1,
    renovacionAutomatica: formulario.renovacionAutomatica || false,
    metodoPagoAlmacenadoId: formulario.metodoPagoAlmacenadoId || null,
  };
  return payload;
}
