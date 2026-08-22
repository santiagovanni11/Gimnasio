// =========================================================
// BAJAS DE MEMBRESÍAS
// Eliminación física, cancelación lógica (con historial) y
// sincronización cuando se elimina un socio.
// =========================================================

import { membresiasService } from "../services/membresiasService";
import { dialogoSistema } from "../services/servicioDialogos";

const ESTADO_CANCELADA = 5;

export function crearBajasMembresias({
  formulario,
  datos,
  ejecutar,
  notificar,
}) {
  const eliminarMembresia = async (membresia) => {
    const aceptado = await dialogoSistema.confirmar({
      titulo: "Eliminar membresía",
      mensaje: `¿ELIMINAR definitivamente la membresía de ${membresia.socioNombre} ${membresia.socioApellido}?`,
      textoAceptar: "Eliminar definitivamente",
      tono: "peligro",
    });

    if (!aceptado) return;

    const resultado = await ejecutar({
      peticion: () =>
        membresiasService.eliminarMembresia(membresia.id),
      onError: datos.setErrorMembresias,
      mensajePermiso: "No tenés permisos para borrar membresías.",
      mensajeError: "No se pudo eliminar la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al eliminar membresía:",
    });

    if (!resultado) return;

    datos.setMembresias((prev) =>
      prev.filter((item) => Number(item.id) !== Number(membresia.id))
    );
    notificar("Membresía eliminada correctamente.");
    cerrarSiEsLaEditada(membresia);
  };

  /** Cancelación lógica: conserva historial (estado Cancelada). */
  const cancelarMembresia = async (membresia) => {
    const aceptado = await dialogoSistema.confirmar({
      titulo: "Cancelar membresía",
      mensaje: `¿Cancelar la membresía de ${membresia.socioNombre} ${membresia.socioApellido}? Conserva el historial.`,
      textoAceptar: "Cancelar membresía",
      tono: "peligro",
    });

    if (!aceptado) return;

    const payload = {
      id: membresia.id,
      socioId: Number(membresia.socioId),
      planId: Number(membresia.planId),
      fechaInicio: membresia.fechaInicio,
      fechaFin: membresia.fechaFin,
      precioAplicado: Number(membresia.precioAplicado || 0),
      estado: ESTADO_CANCELADA,
    };

    const resultado = await ejecutar({
      peticion: () =>
        membresiasService.actualizarMembresia(
          membresia.id,
          payload
        ),
      onError: datos.setErrorMembresias,
      mensajePermiso: "No tenés permisos para modificar membresías.",
      mensajeError: "No se pudo cancelar la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cancelar membresía:",
    });

    if (!resultado) return;

    datos.setMembresias((prev) =>
      prev.map((item) =>
        Number(item.id) === Number(membresia.id)
          ? { ...item, estado: ESTADO_CANCELADA }
          : item
      )
    );
    notificar("Membresía cancelada correctamente.");
    cerrarSiEsLaEditada(membresia);
  };

  /** Tras borrar un socio: limpia formularios y refresca. */
  const sincronizarSocioEliminado = async (
    socioId,
    sociosRestantes
  ) => {
    datos.quitarMembresiasDeSocio(socioId);
    await datos.obtenerMembresias(sociosRestantes);

    if (Number(formulario.socioSeleccionado) === Number(socioId)) {
      formulario.limpiarCampos();
    }

    if (
      formulario.membresiaEditando &&
      Number(formulario.membresiaEditando.socioId) ===
        Number(socioId)
    ) {
      formulario.cerrarFormularioMembresia();
    }
  };

  function cerrarSiEsLaEditada(membresia) {
    if (
      formulario.membresiaEditando &&
      Number(formulario.membresiaEditando.id) ===
        Number(membresia.id)
    ) {
      formulario.cerrarFormularioMembresia();
    }
  }

  return {
    eliminarMembresia,
    cancelarMembresia,
    sincronizarSocioEliminado,
  };
}
