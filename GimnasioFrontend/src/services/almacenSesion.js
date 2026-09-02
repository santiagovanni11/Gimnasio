// =========================================================
// ALMACÉN DE SESIÓN
// Único punto que decide dónde vive la sesión: localStorage
// ("recordarme en este equipo") o sessionStorage (solo la
// pestaña actual). El resto de la app consume estos helpers.
// =========================================================

const CLAVES = ["token", "rol", "usuarioId", "expira", "nombre", "apellido"];

const leer = (clave) =>
  localStorage.getItem(clave) || sessionStorage.getItem(clave);

/**
 * Guarda la sesión completa. Limpia ambos almacenes antes
 * para evitar restos de una sesión anterior con otro modo.
 */
export const guardarSesion = (
  { token, rol, usuarioId, expira, nombre, apellido },
  recordar = true
) => {
  limpiarSesion();

  const destino = recordar ? localStorage : sessionStorage;

  destino.setItem("token", token);
  destino.setItem("rol", rol ?? "");
  destino.setItem("usuarioId", String(usuarioId ?? ""));
  destino.setItem("nombre", nombre ?? "");
  destino.setItem("apellido", apellido ?? "");

  if (expira) {
    destino.setItem("expira", String(expira));
  }
};

export const obtenerToken = () => leer("token");

export const obtenerRol = () => leer("rol") || "";

export const obtenerUsuarioId = () => leer("usuarioId") || "";

export const obtenerNombre = () => leer("nombre") || "";

export const obtenerApellido = () => leer("apellido") || "";

export const obtenerExpira = () => leer("expira");

export const haySesion = () => Boolean(obtenerToken());

/** Borra la sesión de ambos almacenes. */
export const limpiarSesion = () => {
  [localStorage, sessionStorage].forEach((almacen) =>
    CLAVES.forEach((clave) => almacen.removeItem(clave))
  );
};
