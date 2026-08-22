// =========================================================
// SERVICIO DE ROLES
// Listado de roles (gestión de usuarios).
// =========================================================

import { apiRequest } from "./apiClient";

export const rolesService = {
  async obtenerRoles() {
    return apiRequest("Roles");
  },
};
