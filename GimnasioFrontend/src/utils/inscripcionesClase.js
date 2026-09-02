// =========================================================
// UTILIDADES DE INSCRIPCIONES A CLASES
// Estados, badge visual y reglas de vigencia/cupo. Una
// inscripción vencida deja de ocupar cupo sin borrarse
// (recálculo perezoso contra la fecha de referencia).
// =========================================================

import { aISO } from "./fechas";

export const ESTADO_INSCRIPCION = {
  RESERVADA: 1,
  CONFIRMADA: 2,
  ASISTIO: 3,
  CANCELADA: 4,
  NO_ASISTIO: 5,
};

export const estadoInscripcionTexto = (valor) => {
  const mapa = {
    [ESTADO_INSCRIPCION.RESERVADA]: "Reservada",
    [ESTADO_INSCRIPCION.CONFIRMADA]: "Confirmada",
    [ESTADO_INSCRIPCION.ASISTIO]: "Asistió",
    [ESTADO_INSCRIPCION.CANCELADA]: "Cancelada",
    [ESTADO_INSCRIPCION.NO_ASISTIO]: "No asistió",
  };

  return mapa[Number(valor)] || "-";
};

/** Clase CSS del badge según el estado de la inscripción. */
export const claseEstadoInscripcion = (valor) => {
  const estado = Number(valor);

  if (estado === ESTADO_INSCRIPCION.CANCELADA) {
    return "status-inactive";
  }

  return estado === ESTADO_INSCRIPCION.NO_ASISTIO
    ? "status-rejected"
    : "status-active";
};

/** ¿La inscripción tiene una vigencia ya vencida a hoy? */
export const inscripcionVencida = (
  inscripcion,
  hoy = new Date()
) => {
  const hasta = String(inscripcion?.fechaHasta ?? "").slice(0, 10);

  return hasta !== "" && hasta < aISO(hoy);
};

/** ¿Cuenta como cupo? Vigente (no vencida) y no cancelada. */
export const ocupaCupo = (inscripcion, hoy = new Date()) =>
  Number(inscripcion.estado) !== ESTADO_INSCRIPCION.CANCELADA &&
  !inscripcionVencida(inscripcion, hoy);

/** Inscriptos vigentes de un horario. */
export const inscriptosDeHorario = (
  inscripciones = [],
  horarioId,
  hoy = new Date()
) =>
  inscripciones.filter(
    (i) =>
      Number(i.horarioClaseId) === Number(horarioId) &&
      ocupaCupo(i, hoy)
  );

/** Cupo ocupado/libre de un horario según su clase. */
export const cupoDeHorario = (
  inscripciones,
  horario,
  capacidadPorClase,
  hoy = new Date()
) => {
  const ocupados = inscriptosDeHorario(
    inscripciones,
    horario.id,
    hoy
  ).length;

  return {
    ocupados,
    capacidad: capacidadPorClase,
    libres: Math.max(0, capacidadPorClase - ocupados),
    lleno: ocupados >= capacidadPorClase,
  };
};
