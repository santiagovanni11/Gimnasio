// =========================================================
// REGISTRO DE ASISTENCIA
// Un solo gesto (Presente/Ausente) que crea la marca si no
// existe o la corrige si ya está cargada. Corregir marcas es
// exclusivo de Admin + Recepcionista (PUT del backend); los
// demás roles solo pueden tomar lista por primera vez.
// =========================================================

import { clasesService } from "../services/clasesService";
import { marcaDeInscripcion } from "../utils/asistencias";

export function crearRegistroAsistencia({
  ejecutar,
  obtenerAsistencias,
  avisarError,
}) {
  /**
   * @param {object} p
   * @param {object} p.inscripcion DTO de inscripción.
   * @param {Array} p.asistencias Listado vigente en pantalla.
   * @param {string} p.fechaIso yyyy-mm-dd seleccionado.
   * @param {boolean} p.puedeEditar Admin/Recepción.
   */
  const marcar = async ({
    inscripcion,
    presente,
    fechaIso,
    asistencias,
    puedeEditar,
    motivo,
    detalleMotivo,
  }) => {
    const existente = marcaDeInscripcion(
      asistencias,
      inscripcion.id,
      fechaIso
    );

    if (existente && !puedeEditar) {
      avisarError(
        "La marca ya fue registrada; solo Recepción o " +
          "Administración puede corregirla."
      );
      return false;
    }

    const payloadBase = {
      socioId: inscripcion.socioId,
      inscripcionClaseId: inscripcion.id,
      fecha: existente ? existente.fecha : `${fechaIso}T00:00:00`,
      presente,
      ...(motivo ? { motivo } : {}),
      ...(detalleMotivo ? { detalleMotivo } : {}),
    };

    const resultado = await ejecutar({
      peticion: existente
        ? () =>
            clasesService.actualizarAsistencia(
              existente.id,
              payloadBase
            )
        : () =>
            clasesService.crearAsistencia(payloadBase),
      onError: avisarError,
      mensajePermiso:
        "No tenés permisos para registrar asistencias.",
      mensajeError:
        "No se pudo guardar la asistencia.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al marcar asistencia:",
    });

    if (!resultado) return false;

    await obtenerAsistencias?.();

    return true;
  };

  return { marcar };
}
