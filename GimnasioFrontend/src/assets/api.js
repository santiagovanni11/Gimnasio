// URL base de la API.
// - En desarrollo se usa "/api" (relativo): Vite la redirige a
//   la API local a través del proxy de vite.config.js.
// - En producción se define VITE_API_URL con la URL pública del
//   backend (ej. https://tu-api.onrender.com). Si no se define,
//   se asume el mismo origen (para hostear API + frontend juntos).
const urlBase = import.meta.env.VITE_API_URL || "/api";

export const API_URL = urlBase.replace(/\/+$/, "");
