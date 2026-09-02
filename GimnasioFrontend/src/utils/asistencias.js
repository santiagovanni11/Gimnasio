// =========================================================
// UTILIDADES DE ASISTENCIAS
// Cruce fecha ↔ horario ↔ inscripción para la toma diaria.
// Las fechas se comparan por día calendario (yyyy-mm-dd).
// =========================================================

import { ESTADO_INSCRIPCION } from "./inscripcionesClase";

/** Día de semana (0=domingo) de una fecha ISO yyyy-mm-dd. */
export const diaSemanaDeFecha = (iso) => {
  const fecha = new Date(`${iso}T12:00:00`);

  return Number.isNaN(fecha.getTime()) ? -1 : fecha.getDay();
};

/** Asistencias registradas en una fecha. */
export const asistenciasEnFecha = (asistencias = [], iso) =>
  asistencias.filter((a) => String(a.fecha).slice(0, 10) === iso);

/**
 * Marca de un inscripto para una fecha: la asistencia ya
 * registrada o null si todavía no se tomó.
 */
export const marcaDeInscripcion = (
  asistencias = [],
  inscripcionId,
  iso
) =>
  asistencias.find(
    (a) =>
      Number(a.inscripcionClaseId) === Number(inscripcionId) &&
      String(a.fecha).slice(0, 10) === iso
  ) ?? null;

/** Estado real de acceso del socio a la clase según vigencia. */
export const estadoAccesoSocio = (inscripcion, isoFecha = new Date()) => {
  const hasta = String(inscripcion?.fechaHasta ?? "").slice(0, 10);
  const fecha = typeof isoFecha === "string"
    ? isoFecha
    : `${isoFecha.getFullYear()}-${String(isoFecha.getMonth() + 1).padStart(2, "0")}-${String(isoFecha.getDate()).padStart(2, "0")}`;

  if (Number(inscripcion?.estado) === ESTADO_INSCRIPCION.CANCELADA) {
    return "Cancelada";
  }

  if (hasta && hasta < fecha) {
    return "Sin acceso";
  }

  if (Number(inscripcion?.estado) === ESTADO_INSCRIPCION.RESERVADA) {
    return "Reserva";
  }

  return "Activo";
};

/** Resumen de marcas: presentes, ausentes y sin marcar. */
export const resumenDeMarcas = (totales, marcas) => ({
  presentes: marcas.filter((m) => m.presente).length,
  ausentes: marcas.filter((m) => !m.presente).length,
  sinMarcar: Math.max(0, totales - marcas.length),
});
