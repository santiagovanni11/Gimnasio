// =========================================================
// SERVICIO DE SOCIOS
// Operaciones CRUD contra api/Socios.
// =========================================================

import { apiRequest } from "./apiClient";

const construirPayload = (datos, extra = {}) => ({
  nombre: datos.nombre.trim(),
  apellido: datos.apellido.trim(),
  dni: datos.dni.trim(),
  fechaNacimiento: datos.fechaNacimiento,
  telefono: datos.telefono.trim(),
  email: datos.email.trim(),
  direccion:
    datos.direccion.trim() === "" ? null : datos.direccion.trim(),
  ...extra,
});

export const sociosService = {
  async obtenerSocios() {
    return apiRequest("Socios");
  },

  async crearSocio(nuevoSocio) {
    return apiRequest("Socios", {
      method: "POST",
      body: construirPayload(nuevoSocio),
    });
  },

  async actualizarSocio(socioEditando, formulario) {
    return apiRequest(`Socios/${socioEditando.id}`, {
      method: "PUT",
      body: construirPayload(formulario, {
        id: socioEditando.id,
        fechaAlta: socioEditando.fechaAlta,
        activo: socioEditando.activo,
      }),
    });
  },

  /** Baja/alta lógica: reenvía el socio completo con el nuevo estado. */
  async alternarEstado(socio, activo) {
    return apiRequest(`Socios/${socio.id}`, {
      method: "PUT",
      body: {
        id: socio.id,
        nombre: socio.nombre,
        apellido: socio.apellido,
        dni: socio.dni,
        fechaNacimiento: socio.fechaNacimiento,
        telefono: socio.telefono,
        email: socio.email,
        direccion: socio.direccion,
        fechaAlta: socio.fechaAlta,
        activo,
      },
    });
  },

  async eliminarSocio(id) {
    return apiRequest(`Socios/${id}`, { method: "DELETE" });
  },
};
