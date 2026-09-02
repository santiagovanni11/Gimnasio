// =========================================================
// SERVICIO DE CLASES Y HORARIOS
// Catálogo de clases, franjas horarias con profesor.
// Las horas viajan como "HH:mm:ss" (TimeSpan de la API).
// =========================================================

import { apiRequest } from "./apiClient";
import { horaParaApi } from "../utils/clases";

const conSegundos = ({ horaInicio, horaFin, ...resto }) => ({
  ...resto,
  horaInicio: horaParaApi(horaInicio),
  horaFin: horaParaApi(horaFin),
});

export const clasesService = {
  async obtenerClases() {
    return apiRequest("Clases");
  },

  async crearClase(payload) {
    return apiRequest("Clases", { method: "POST", body: payload });
  },

  async actualizarClase(id, payload) {
    return apiRequest(`Clases/${id}`, {
      method: "PUT",
      body: { ...payload, id },
    });
  },

  /**
   * Baja física. enCascada=true también elimina sus horarios
   * (la API lo rechaza si hay socios inscriptos).
   */
  async eliminarClase(id, enCascada = false) {
    return apiRequest(
      `Clases/${id}${enCascada ? "?enCascada=true" : ""}`,
      { method: "DELETE" }
    );
  },

  /** Baja/alta lógica: conserva horarios e historial. */
  async cambiarEstado(id, activa) {
    return apiRequest(`Clases/${id}/estado`, {
      method: "PUT",
      body: activa,
    });
  },

  /** Horarios de todas las clases, con nombre de clase/profesor. */
  async obtenerHorarios() {
    return apiRequest("HorariosClases");
  },

  async crearHorario(payload) {
    return apiRequest("HorariosClases", {
      method: "POST",
      body: conSegundos(payload),
    });
  },

  async actualizarHorario(id, payload) {
    return apiRequest(`HorariosClases/${id}`, {
      method: "PUT",
      body: conSegundos({ ...payload, id }),
    });
  },

  async eliminarHorario(id) {
    return apiRequest(`HorariosClases/${id}`, {
      method: "DELETE",
    });
  },

  /** Inscripciones de todos los horarios, con nombres. */
  async obtenerInscripciones() {
    return apiRequest("InscripcionesClases");
  },

  /** Alta de inscripción; capacidad y duplicados en la API. */
  async inscribir({ socioId, horarioClaseId }) {
    return apiRequest("InscripcionesClases", {
      method: "POST",
      body: { socioId, horarioClaseId },
    });
  },

  /** Alta masiva: varios socios a un mismo horario. */
  async inscribirMasivo({ horarioClaseId, sociosIds, fechaHasta }) {
    return apiRequest("InscripcionesClases/masivo", {
      method: "POST",
      body: { horarioClaseId, sociosIds, fechaHasta: fechaHasta || null },
    });
  },

  /** Cancelación lógica: libera el cupo, conserva historial. */
  async cancelarInscripcion(id) {
    return apiRequest(`InscripcionesClases/${id}`, {
      method: "DELETE",
    });
  },

  /** Historial completo de asistencias a clases. */
  async obtenerAsistencias() {
    return apiRequest("Asistencias");
  },

  /** Toma de asistencia: crear marca nueva (todos los roles). */
  async crearAsistencia(payload) {
    return apiRequest("Asistencias", {
      method: "POST",
      body: payload,
    });
  },

  /** Corregir una marca existente (Admin + Recepcionista). */
  async actualizarAsistencia(id, payload) {
    return apiRequest(`Asistencias/${id}`, {
      method: "PUT",
      body: { ...payload, id },
    });
  },
};
