// =========================================================
// SERVICIO DE USUARIOS
// Gestión de cuentas: alta, edición, listado, roles, estados,
// reset de contraseña y auditoría.
// =========================================================

import { apiRequest } from "./apiClient";

export const usuariosService = {
  async obtenerUsuarios() {
    return apiRequest("Usuarios");
  },

  /** Alta manual de una cuenta (Administrador). */
  async crear(payload) {
    return apiRequest("Usuarios", { method: "POST", body: payload });
  },

  /** Edición de datos; password vacía = sin cambio. */
  async actualizar(id, payload) {
    return apiRequest(`Usuarios/${id}`, {
      method: "PUT",
      body: payload,
    });
  },

  async cambiarEstado(id, activo) {
    return apiRequest(`Usuarios/${id}/estado`, {
      method: "PUT",
      body: activo,
    });
  },

  async cambiarRol(id, rolId) {
    return apiRequest(`Usuarios/${id}/rol`, {
      method: "PUT",
      body: { rolId },
    });
  },

  /** Reset de contraseña de OTRO usuario (Administrador). */
  async resetearPassword(id, password) {
    return apiRequest(`Usuarios/${id}/password`, {
      method: "PUT",
      body: { password },
    });
  },

  async desbloquear(id) {
    return apiRequest(`Usuarios/${id}/desbloqueo`, {
      method: "PUT",
    });
  },

  async eliminar(id) {
    return apiRequest(`Usuarios/${id}`, { method: "DELETE" });
  },

  async obtenerAuditoria(id) {
    return apiRequest(`Usuarios/${id}/auditoria`);
  },
};
