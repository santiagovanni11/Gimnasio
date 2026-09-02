// =========================================================
// DISPONIBILIDAD DE PROFESORES
// Un profesor no puede estar en dos franjas que se superpongan
// el mismo día, aunque sea en otra clase. Borde compartido
// (19:00-20:00 y 20:00-21:00) NO cuenta como choque.
// =========================================================

import { franjasSuperponen } from "./clases";

/**
 * Profesores sin franja que se superponga con la propuesta,
 * ese día. excluirId permite editar un horario existente.
 * Si la franja está incompleta devuelve todos.
 */
export const profesoresLibres = (
  profesores = [],
  horarios = [],
  franja,
  excluirId = null
) => {
  const definida =
    (franja.diaSemana || franja.diaSemana === 0) &&
    franja.horaInicio &&
    franja.horaFin;

  const activos = profesores.filter((p) => p?.activo !== false);

  if (!definida) return activos;

  return activos.filter(
    (p) => !horarios.some((h) =>
      h.id !== excluirId &&
      Number(h.empleadoId) === Number(p.empleadoId) &&
      Number(h.diaSemana) === Number(franja.diaSemana) &&
      franjasSuperponen(
        franja.horaInicio, franja.horaFin,
        h.horaInicio, h.horaFin)));
};
