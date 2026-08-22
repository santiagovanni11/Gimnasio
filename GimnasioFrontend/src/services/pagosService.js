// =========================================================
// SERVICIO DE PAGOS
// Operaciones contra api/Pagos.
// =========================================================

import { apiRequest } from "./apiClient";

export const pagosService = {
  async obtenerPagos() {
    return apiRequest("Pagos");
  },

  async crearPago(payload) {
    return apiRequest("Pagos", { method: "POST", body: payload });
  },

  async actualizarPago(id, payload) {
    return apiRequest(`Pagos/${id}`, { method: "PUT", body: payload });
  },

  async eliminarPago(id, motivo) {
    const query = motivo
      ? `?motivo=${encodeURIComponent(motivo)}`
      : "";

    return apiRequest(`Pagos/${id}${query}`, { method: "DELETE" });
  },
};
