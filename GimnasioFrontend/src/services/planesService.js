// =========================================================
// SERVICIO DE PLANES
// Consulta de planes y actualización de precios por duración.
// =========================================================

import { apiRequest } from "./apiClient";

export const planesService = {
  async obtenerPlanes() {
    return apiRequest("Planes");
  },

  async actualizarPrecios(planId, precios, vigenteDesde = null) {
    return apiRequest(`Planes/${planId}/precios`, {
      method: "PUT",
      body: { ...precios, vigenteDesde },
    });
  },

  async historialPrecios(planId) {
    return apiRequest(`Planes/${planId}/precios/historial`);
  },

  /** Cambios programados aún no vigentes (todos los planes). */
  async cambiosPendientes() {
    return apiRequest("Planes/precios/pendientes");
  },

  /** Anula un cambio programado que aún no rige. */
  async anularCambioPendiente(id) {
    return apiRequest(`Planes/precios/pendientes/${id}`, {
      method: "DELETE",
    });
  },

  /** Catálogo de beneficios y clases activos para asociar. */
  async referencias() {
    return apiRequest("Planes/referencias");
  },

  /** Reemplaza beneficios y clases asociados a un plan. */
  async asignarBeneficiosClases(id, beneficios, clases) {
    return apiRequest(`Planes/${id}/beneficios-clases`, {
      method: "PUT",
      body: { beneficios, clases },
    });
  },

  async cambiarEstado(id, activo) {
    return apiRequest(`Planes/${id}/estado`, {
      method: "PUT",
      body: activo,
    });
  },

  async crearPlan(payload) {
    return apiRequest("Planes", { method: "POST", body: payload });
  },

  async eliminarPlan(id) {
    return apiRequest(`Planes/${id}`, { method: "DELETE" });
  },
};
