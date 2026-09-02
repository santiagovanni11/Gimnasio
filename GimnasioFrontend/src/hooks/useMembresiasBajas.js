// =========================================================
// BAJAS DE MEMBRESÍAS
// Eliminación física y cancelación lógica (con historial).
// La baja de socios es lógica, así que no hay membresías
// huérfanas que sincronizar.
// =========================================================

import { obtenerNombre, obtenerApellido } from "../services/almacenSesion";
import { membresiasService } from "../services/membresiasService";
import { dialogoSistema } from "../services/servicioDialogos";
import { registrarEventoMembresia } from "../utils/membresiasMetadata";

const ESTADO_CANCELADA = 5;

export function crearBajasMembresias({
  formulario,
  datos,
  ejecutar,
  notificar,
}) {
  const eliminarMembresia = async (membresia) => {
    const usuario = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";
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

    registrarEventoMembresia(
      Number(membresia.id),
      "Eliminación de membresía",
      `Se eliminó la membresía de ${membresia.socioNombre} ${membresia.socioApellido}`,
      usuario
    );

    datos.setMembresias((prev) =>
      prev.filter((item) => Number(item.id) !== Number(membresia.id))
    );
    notificar("Membresía eliminada correctamente.");
    cerrarSiEsLaEditada(membresia);
  };

  /** Cancelación lógica: conserva historial (estado Cancelada). */
  const cancelarMembresia = async (membresia, opciones = {}) => {
    const usuario = [obtenerNombre(), obtenerApellido()].filter(Boolean).join(" ") || "Sistema";
    const confirmar = opciones.confirmar ?? true;

    if (confirmar) {
      const aceptado = await dialogoSistema.confirmar({
        titulo: "Cancelar membresía",
        mensaje: `¿Cancelar la membresía de ${membresia.socioNombre} ${membresia.socioApellido}? Conserva el historial.`,
        textoAceptar: "Cancelar membresía",
        tono: "peligro",
      });

      if (!aceptado) return;
    }

    const resultado = await ejecutar({
      peticion: () =>
        membresiasService.cancelarMembresia(membresia.id),
      onError: datos.setErrorMembresias,
      mensajePermiso: "No tenés permisos para modificar membresías.",
      mensajeError: "No se pudo cancelar la membresía.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cancelar membresía:",
    });

    if (!resultado) return;

    registrarEventoMembresia(
      Number(membresia.id),
      "Cancelación de membresía",
      `Se canceló la membresía · ${membresia.planNombre || "plan"}`,
      usuario
    );

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
  };
}
