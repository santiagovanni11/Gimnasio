// =========================================================
// PRIMER HORARIO AL CREAR UNA CLASE
// Validación "todo o nada" de la franja opcional y su alta.
// Devuelve { ok } o { ok:false, error } con el motivo real
// (ej.: profesor ya asignado) para mostrarlo como alerta.
// =========================================================

import { clasesService } from "../services/clasesService";

/** ¿El usuario empezó a completar el bloque de horario? */
export const hayInicioHorario = (campos) =>
  Boolean(
    campos.empleadoId ||
    campos.diaSemana ||
    campos.horaInicio ||
    campos.horaFin
  );

/** Errores de completitud/coherencia de la franja; "" si OK. */
export const validarFranja = (campos) => {
  if (!campos.empleadoId) return "Seleccioná el profesor.";

  if (!campos.diaSemana && campos.diaSemana !== 0) {
    return "Seleccioná el día del primer horario.";
  }

  if (!campos.horaInicio || !campos.horaFin) {
    return "Completá la franja horaria del profesor.";
  }

  if (campos.horaFin <= campos.horaInicio) {
    return "La hora de fin debe ser posterior al inicio.";
  }

  return "";
};

/**
 * Crea el primer horario de una clase recién nacida.
 * @returns {{ ok: boolean, error?: string }}
 */
export const crearPrimerHorario = async ({
  ejecutar,
  claseId,
  campos,
}) => {
  let motivo = "";

  const resultado = await ejecutar({
    peticion: () =>
      clasesService.crearHorario({
        claseId: Number(claseId),
        empleadoId: Number(campos.empleadoId),
        diaSemana: Number(campos.diaSemana),
        horaInicio: campos.horaInicio,
        horaFin: campos.horaFin,
      }),
    onError: (mensaje) => {
      motivo = mensaje;
      console.error("Error al asignar primer horario:", mensaje);
    },
    mensajePermiso: "Solo el Administrador asigna horarios.",
    mensajeError: "No se pudo asignar el horario.",
    mensajeRed: "No se pudo conectar con la API.",
    etiquetaLog: "Error al asignar primer horario:",
  });

  return resultado
    ? { ok: true }
    : { ok: false, error: motivo };
};