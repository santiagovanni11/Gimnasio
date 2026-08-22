// =========================================================
// EJECUTOR DE TAREAS HTTP PARA HOOKS DE DOMINIO
// Manejo uniforme de: sesión expirada (401), permisos (403),
// errores de la API y errores de red. Elimina la duplicación
// que existía en cada operación de cada hook.
// =========================================================

import { haySesion } from "./almacenSesion";
import { mensajeDeError } from "./apiClient";

/**
 * Crea una función `ejecutar` ligada a un hook de dominio.
 *
 * `ejecutar({ peticion, onError, mensajePermiso, mensajeError,
 *             mensajeRed, etiquetaLog })` devuelve
 * `{ datos }` si todo salió bien, o `null` si falló
 * (dejando el error ya notificado en `onError`).
 */
export const crearEjecutorApi = ({ onSesionExpirada }) => {
  return async ({
    peticion,
    onError,
    mensajePermiso = "No tenés permisos para esta acción.",
    mensajeError = "Ocurrió un error.",
    mensajeRed = "No se pudo conectar con la API.",
    etiquetaLog = "Error de API:",
  }) => {
    if (!haySesion()) {
      onSesionExpirada?.();
      return null;
    }

    try {
      const { respuesta, datos } = await peticion();

      if (respuesta.status === 401) {
        onSesionExpirada?.();
        return null;
      }

      if (respuesta.status === 403) {
        onError?.(mensajePermiso);
        return null;
      }

      if (!respuesta.ok) {
        const porDefecto =
          typeof mensajeError === "function"
            ? mensajeError(respuesta.status)
            : mensajeError;

        onError?.(mensajeDeError(datos, porDefecto));
        return null;
      }

      return { datos };
    } catch (error) {
      console.error(etiquetaLog, error);
      onError?.(mensajeRed);
      return null;
    }
  };
};
