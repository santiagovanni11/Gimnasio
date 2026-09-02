// =========================================================
// formularioUsuario.js — Estado inicial y validación pura
// del formulario de cuentas (alta/edición).
// =========================================================

import { validarEmail } from "../services/authService";

export const CAMPOS_INICIALES = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  rolId: "",
};

/** Valores al abrir la edición de una cuenta existente. */
export function camposEdicionUsuario(usuario) {
  return {
    nombre: usuario.nombre ?? "",
    apellido: usuario.apellido ?? "",
    email: usuario.email ?? "",
    password: "",
    rolId: String(usuario.rolId ?? ""),
  };
}

/** Valida los campos; devuelve "" si todo está bien. */
export function validarCamposUsuario(campos, usuarioEditando) {
  const errorEmail = validarEmail(campos.email);
  if (errorEmail) return errorEmail;

  // Solo el alta define contraseña; el cambio de clave de una
  // cuenta existente se hace desde su fila.
  if (!usuarioEditando && campos.password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (!campos.rolId) return "Seleccioná un rol.";
  return "";
}
