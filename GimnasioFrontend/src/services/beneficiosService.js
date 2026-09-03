// =========================================================
// SERVICIO DE BENEFICIOS
// Catálogo de beneficios del gimnasio.
// =========================================================

import { apiRequest } from "./apiClient";

export const beneficiosService = {
  /** Crea un beneficio. Si no se indica descripción, se usa el nombre. */
  async crearBeneficio(nombre, descripcion = nombre) {
    return apiRequest("Beneficios", {
      method: "POST",
      body: { nombre, descripcion },
    });
  },

  /** Baja lógica de un beneficio del catálogo. */
  async eliminarBeneficio(id) {
    return apiRequest(`Beneficios/${id}`, { method: "DELETE" });
  },
};
