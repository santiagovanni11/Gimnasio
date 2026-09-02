// =========================================================
// BAJAS Y ESTADOS DE CLASES, HORARIOS E INSCRIPCIONES
// Clase con horarios: cascada consentida (la API bloquea si
// hay inscriptos). Horario: físico. Inscripción: lógica.
// Los textos de confirmación viven en utils/bajasClases.
// =========================================================

import { dialogoSistema } from "../services/servicioDialogos";
import { clasesService } from "../services/clasesService";
import {
  mensajeEliminarClase,
  mensajeEliminarHorario,
  mensajeCancelarInscripcion,
} from "../utils/bajasClases";

export function crearBajasClases({ ejecutar, notificar, avisarError, obtenerTodo }) {
  /** Baja física de una clase (con posible cascada de horarios). */
  const eliminarClase = async (clase, cantidadHorarios = 0) => {
    const acepta = await dialogoSistema.confirmar({
      titulo: "Eliminar clase",
      mensaje: mensajeEliminarClase(clase, cantidadHorarios),
      textoAceptar: "Eliminar",
      tono: "peligro",
    });

    if (!acepta) return;

    const resultado = await ejecutar({
      peticion: () => clasesService.eliminarClase(clase.id, cantidadHorarios > 0),
      onError: avisarError,
      mensajePermiso: "Solo el Administrador puede eliminar clases.",
      mensajeError: "No se pudo eliminar la clase.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al eliminar clase:",
    });

    if (!resultado) return;

    notificar(`Clase "${clase.nombre}" eliminada.`);
    await obtenerTodo?.();
  };

  const eliminarHorario = async (horario) => {
    const acepta = await dialogoSistema.confirmar({
      titulo: "Eliminar horario",
      mensaje: mensajeEliminarHorario(horario),
      textoAceptar: "Eliminar",
      tono: "peligro",
    });

    if (!acepta) return;

    const resultado = await ejecutar({
      peticion: () => clasesService.eliminarHorario(horario.id),
      onError: avisarError,
      mensajePermiso: "Solo el Administrador puede eliminar horarios.",
      mensajeError: "No se pudo eliminar el horario.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al eliminar horario:",
    });

    if (!resultado) return;

    notificar("Horario eliminado.");
    await obtenerTodo?.();
  };

  /** Cancelación lógica: libera el cupo, no borra historial. */
  const cancelarInscripcion = async (inscripcion) => {
    const acepta = await dialogoSistema.confirmar({
      titulo: "Cancelar inscripción",
      mensaje: mensajeCancelarInscripcion(inscripcion),
      textoAceptar: "Cancelar inscripción",
      tono: "peligro",
    });

    if (!acepta) return;

    const resultado = await ejecutar({
      peticion: () => clasesService.cancelarInscripcion(inscripcion.id),
      onError: avisarError,
      mensajePermiso: "No tenés permisos para gestionar inscripciones.",
      mensajeError: "No se pudo cancelar la inscripción.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cancelar inscripción:",
    });

    if (!resultado) return;

    notificar(
      `Inscripción de ${inscripcion.socioNombre} ${inscripcion.socioApellido} cancelada.`
    );
    await obtenerTodo?.();
  };

  /** Baja lógica: conserva horarios, inscriptos e historia. */
  const alternarEstadoClase = async (clase) => {
    const desactiva = clase.activa !== false;

    const resultado = await ejecutar({
      peticion: () => clasesService.cambiarEstado(clase.id, !desactiva),
      onError: avisarError,
      mensajePermiso: "Solo el Administrador puede cambiar el estado.",
      mensajeError: "No se pudo cambiar el estado de la clase.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cambiar estado de clase:",
    });

    if (!resultado) return;

    notificar(
      desactiva
        ? `Clase "${clase.nombre}" desactivada.`
        : `Clase "${clase.nombre}" reactivada.`
    );
    await obtenerTodo?.();
  };

  return {
    eliminarClase,
    alternarEstadoClase,
    eliminarHorario,
    cancelarInscripcion,
  };
}
