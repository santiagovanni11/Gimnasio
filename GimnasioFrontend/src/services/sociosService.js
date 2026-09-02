// =========================================================
// SERVICIO DE SOCIOS
// Operaciones contra api/Socios. La baja es siempre lógica
// (alternarEstado con Activo=false); no existe borrado
// físico para preservar el historial del socio.
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
    datos.direccion?.trim() === "" ? null : datos.direccion?.trim() || null,
  fotoUrl:
    datos.fotoUrl?.trim() === "" ? null : datos.fotoUrl?.trim() || null,
  contactoEmergencia:
    datos.contactoEmergencia?.trim() === "" ? null : datos.contactoEmergencia?.trim() || null,
  telefonoEmergencia:
    datos.telefonoEmergencia?.trim() === "" ? null : datos.telefonoEmergencia?.trim() || null,
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

  /** Importación masiva: recibe un arreglo de socios ya parseados. */
  async importarSocios(lista) {
    return apiRequest("Socios/importar", {
      method: "POST",
      body: lista,
    });
  },

  /** Métricas agregadas para el panel de resumen. */
  async obtenerEstadisticas() {
    return apiRequest("Socios/estadisticas");
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
        fotoUrl: socio.fotoUrl,
        contactoEmergencia: socio.contactoEmergencia,
        telefonoEmergencia: socio.telefonoEmergencia,
        fechaAlta: socio.fechaAlta,
        activo,
      },
    });
  },

  /** Últimas asistencias de un socio para la ficha. */
  async obtenerAsistenciasSocio(socioId, limite = 10) {
    return apiRequest(`Socios/${socioId}/asistencias?limite=${limite}`);
  },
};
