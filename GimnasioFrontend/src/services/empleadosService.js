// =========================================================
// SERVICIO DE EMPLEADOS
// Profesores para horarios de clases: provienen de los
// USUARIOS activos con rol Profesor (la API crea su legajo).
// =========================================================

import { apiRequest } from "./apiClient";

export const empleadosService = {
  async obtenerProfesores() {
    return apiRequest("Empleados/profesores");
  },
};
