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
