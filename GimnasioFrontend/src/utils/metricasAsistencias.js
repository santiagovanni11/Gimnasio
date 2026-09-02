// =========================================================
// MÉTRICAS DE ASISTENCIA POR HORARIO
// Tasa de presencia de cada franja semanal dentro de un
// rango de fechas. Solo cuenta marcas reales; los horarios
// sin marcas en el rango no se listan.
// =========================================================

import { aISO } from "./fechas";
import {
  cupoDeHorario,
  ocupaCupo,
} from "./inscripcionesClase";

/** Rango inclusivo de los últimos N días (hoy incluido). */
export const rangoUltimosDias = (dias, hoy = new Date()) => {
  const inicio = new Date(hoy);
  inicio.setDate(inicio.getDate() - (Number(dias) - 1));

  return { desde: aISO(inicio), hasta: aISO(hoy) };
};

export const enRango = (iso, rango) => {
  const dia = String(iso ?? "").slice(0, 10);

  return dia >= rango.desde && dia <= rango.hasta;
};

/** Color del badge según la tasa (0..1); null si no hay datos. */
export const claseTasaAsistencia = (tasa) => {
  if (tasa === null) return "";

  return tasa >= 0.8
    ? "status-active"
    : tasa >= 0.5
    ? "status-warning"
    : "status-rejected";
};

/**
 * Resumen por franja horaria: marcas del rango agrupadas por
 * horario vía sus inscripciones vigentes.
 * @returns {Array<{horario, clase, inscriptos, marcas, presentes, ausentes, tasa}>}
 */
export const resumenAsistenciaPorHorario = ({
  horarios = [],
  clases = [],
  inscripciones = [],
  asistencias = [],
  desde,
  hasta,
}) => {
  const rango = { desde, hasta };

  const claseDe = new Map(clases.map((c) => [c.id, c]));

  const vigentesPorHorario = new Map();

  inscripciones
    .filter((i) => ocupaCupo(i))
    .forEach((inscripcion) => {
      const lista =
        vigentesPorHorario.get(inscripcion.horarioClaseId) ??
        [];

      lista.push(inscripcion);
      vigentesPorHorario.set(
        inscripcion.horarioClaseId,
        lista
      );
    });

  return horarios
    .map((horario) => {
      const inscriptos =
        vigentesPorHorario.get(horario.id) ?? [];

      const idsInscripcion = new Set(
        inscriptos.map((i) => Number(i.id))
      );

      const marcas = asistencias.filter(
        (a) =>
          idsInscripcion.has(
            Number(a.inscripcionClaseId)
          ) && enRango(a.fecha, rango)
      );

      const presentes = marcas.filter(
        (m) => m.presente
      ).length;

      const clase = claseDe.get(horario.claseId);

      const cupo = cupoDeHorario(
        inscripciones,
        horario,
        clase?.capacidadMaxima ?? 0
      );

      return {
        horario,
        clase,
        inscriptos: cupo.ocupados,
        capacidad: cupo.capacidad,
        marcas: marcas.length,
        presentes,
        ausentes: marcas.length - presentes,
        tasa:
          marcas.length > 0
            ? presentes / marcas.length
            : null,
      };
    })
    .filter((fila) => fila.marcas > 0)
    .sort((a, b) => a.tasa - b.tasa);
};
