// =========================================================
// CHOQUE DE HORARIO DE SOCIOS
// Un socio no puede estar en dos clases cuyas franjas se
// superpongan el MISMO día (aunque sean clases distintas).
// Reusa franjasSuperponen para mantener idéntico criterio al
// de profesores. La inscripción en el propio horario destino
// (duplicado) no cuenta aquí: la cubre el estado "ocupado".
// =========================================================

import { franjasSuperponen } from "./clases";
import { ocupaCupo } from "./inscripcionesClase";

/**
 * Socios que ya ocupan, el mismo día, una franja que se
 * superpone con la del horarioDestino. Devuelve un Set de
 * ids. Si el destino está incompleto, devuelve vacío.
 */
export const sociosConChoqueHorario = (
  inscripciones = [],
  horarios = [],
  horarioDestino,
  hoy = new Date()
) => {
  const objetivo = horarioDestino;
  const sinDestino =
    objetivo?.id == null || objetivo?.diaSemana == null;

  return new Set(
    inscripciones
      .filter((i) => ocupaCupo(i, hoy))
      .filter(
        (i) =>
          !sinDestino &&
          Number(i.horarioClaseId) !== Number(objetivo.id)
      )
      .map((i) => {
        const h = horarios.find(
          (x) => Number(x.id) === Number(i.horarioClaseId)
        );

        return h &&
          Number(h.diaSemana) ===
            Number(objetivo.diaSemana) &&
          franjasSuperponen(
            h.horaInicio, h.horaFin,
            objetivo.horaInicio, objetivo.horaFin
          )
          ? Number(i.socioId)
          : null;
      })
      .filter(Boolean)
  );
};