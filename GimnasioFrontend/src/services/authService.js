// =========================================================
// SERVICIO DE AUTENTICACIÓN
// Login y registro de cuentas contra la API.
// =========================================================

import { apiRequest } from "./apiClient";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Email con formato válido y presente. */
export const validarEmail = (email) => {
  const emailNormalizado = String(email ?? "").trim();

  if (!emailNormalizado) {
    return "El email es obligatorio.";
  }

  return EMAIL_VALIDO.test(emailNormalizado)
    ? ""
    : "Ingresá un email válido.";
};

const validarCredenciales = (email, password) => {
  const errorEmail = validarEmail(email);

  if (errorEmail) {
    return errorEmail;
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

  /** Datos propios del usuario autenticado (para el saludo). */
  async obtenerPerfil() {
    return apiRequest("Auth/perfil");
  },

  /** Paso 1 de recuperación: pide el código al email. */
  async enviarCodigoRecuperacion(email) {
    return apiRequest("Auth/recuperar-password", {
      method: "POST",
      body: { email: email.trim() },
      auth: false,
    });
  },

  /** Paso 2 de recuperación: código + nueva contraseña. */
  async restablecerPassword({ email, codigo, passwordNueva }) {
    return apiRequest("Auth/restablecer-password", {
      method: "POST",
      body: { email: email.trim(), codigo, passwordNueva },
      auth: false,
    });
  },
};
