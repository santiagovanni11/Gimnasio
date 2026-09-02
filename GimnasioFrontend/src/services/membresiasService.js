// =========================================================
// SERVICIO DE MEMBRESÍAS
// Operaciones contra api/Membresias.
// =========================================================

import { apiRequest } from "./apiClient";

export const membresiasService = {
  async obtenerMembresias() {
    return apiRequest("Membresias");
  },

  async crearMembresia(payload) {
    return apiRequest("Membresias", { method: "POST", body: payload });
  },

  /**
   * Alta/edición. Con `renovacion` el backend sella un
   * período nuevo (UltimaRenovacion) para saldos y rechazos.
   */
  async actualizarMembresia(id, payload, renovacion = false) {
    const query = renovacion ? "?renovacion=true" : "";

    return apiRequest(`Membresias/${id}${query}`, {
      method: "PUT",
      body: payload,
    });
  },

  async cancelarMembresia(id) {
    return apiRequest(`Membresias/${id}/cancelar`, {
      method: "PUT",
    });
  },

  async eliminarMembresia(id) {
    return apiRequest(`Membresias/${id}`, { method: "DELETE" });
  },

  async suspenderMembresia(id) {
    return apiRequest(`Membresias/${id}/suspender`, {
      method: "PUT",
    });
  },

  async reactivarMembresia(id) {
    return apiRequest(`Membresias/${id}/reactivar`, {
      method: "PUT",
    });
  },
};
