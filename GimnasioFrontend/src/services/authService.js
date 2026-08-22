// =========================================================
// SERVICIO DE AUTENTICACIÓN
// Login y registro de cuentas contra la API.
// =========================================================

import { apiRequest } from "./apiClient";

const validarCredenciales = (email, password) => {
  const emailNormalizado = email.trim();

  if (!emailNormalizado) {
    return "El email es obligatorio.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
    return "Ingresá un email válido.";
  }

  if (!password) {
    return "La contraseña es obligatoria.";
  }

  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  return "";
};

export const authService = {
  validarCredenciales,

  async iniciarSesion(email, password) {
    return apiRequest("Auth/login", {
      method: "POST",
      body: { email: email.trim(), password },
      auth: false,
    });
  },

  async registrarCuenta({ nombre, apellido, email, password, rolId }) {
    return apiRequest("Auth/registro", {
      method: "POST",
      body: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        password,
        rolId,
      },
      auth: false,
    });
  },

  async obtenerRolesRegistro() {
    return apiRequest("Roles/registro", { auth: false });
  },

  /** Cambio de la propia contraseña (usuario autenticado). */
  async cambiarMiPassword({ passwordActual, passwordNueva }) {
    return apiRequest("Auth/password", {
      method: "PUT",
      body: { passwordActual, passwordNueva },
    });
  },
};
