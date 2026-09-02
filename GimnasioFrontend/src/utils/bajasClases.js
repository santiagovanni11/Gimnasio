// =========================================================
// bajasClases.js — Textos puros de confirmación para clases,
// horarios e inscripciones (desacoplados del hook).
// =========================================================

import { diaSemanaTexto, franjaTexto } from "./clases";

export function mensajeEliminarClase(clase, cantidadHorarios) {
  return cantidadHorarios > 0
    ? `"${clase.nombre}" tiene ${cantidadHorarios} horario(s) ` +
        `(y sus vínculos con planes, si existieran): se eliminan ` +
        `juntos. Si hay socios inscriptos, la API lo rechazará ` +
        `(usá Desactivar). ¿Continuar?`
    : `Se eliminará "${clase.nombre}" definitivamente (incluye ` +
        `vínculos con planes si tuviera). ¿Continuar?`;
}

export function mensajeEliminarHorario(horario) {
  return (
    `${diaSemanaTexto(horario.diaSemana)} ` +
    `${franjaTexto(horario.horaInicio, horario.horaFin)}. ¿Eliminar?`
  );
}

export function mensajeCancelarInscripcion(inscripcion) {
  const socio = `${inscripcion.socioNombre} ${inscripcion.socioApellido}`;
  return (
    `${socio} dejará de ocupar cupo en este horario. ` +
    `¿Confirmar la cancelación?`
  );
}
