import { apiRequest } from "./apiClient";

export const metodosPagoService = {
  async obtener(socioId) {
    return apiRequest(`MetodosPagoAlmacenados?socioId=${socioId}`);
  },

  async crear(metodo) {
    return apiRequest("MetodosPagoAlmacenados", {
      method: "POST",
      body: metodo,
    });
  },

  async eliminar(id) {
    return apiRequest(`MetodosPagoAlmacenados/${id}`, {
      method: "DELETE",
    });
  },
};
