// =========================================================
// CLIENTE HTTP CENTRAL
// Único punto con la lógica de red: headers de autenticación,
// parsing de respuesta y manejo de sesión expirada.
// La persistencia del token vive en almacenSesion.
// =========================================================

import { API_URL } from "../assets/api";
import { obtenerToken } from "./almacenSesion";

export const buildAuthHeaders = (extraHeaders = {}) => {
  const token = obtenerToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const parseApiResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/**
 * Ejecuta una request contra la API y devuelve
 * { respuesta, datos } sin lanzar excepciones por status.
 *
 * @param {string} path - Ruta relativa (ej: "Pagos", "Socios/5")
 * @param {{method?: string, body?: object, auth?: boolean}} opciones
 */
export const apiRequest = async (
  path,
  { method = "GET", body, auth = true } = {}
) => {
  const headersBase = body !== undefined
    ? { "Content-Type": "application/json" }
    : {};

  const respuesta = await fetch(`${API_URL}/${path}`, {
    method,
    headers: auth ? buildAuthHeaders(headersBase) : headersBase,
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
  });

  const datos = await parseApiResponse(respuesta);

  return { respuesta, datos };
};

/** Mensaje de error estándar: prefiere el texto de la API. */
export const mensajeDeError = (datos, mensajePorDefecto) =>
  typeof datos === "string" && datos ? datos : mensajePorDefecto;
