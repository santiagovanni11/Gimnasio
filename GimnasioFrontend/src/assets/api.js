// Ruta relativa: las peticiones salen desde el mismo origen
// (https://localhost:5173) y Vite las redirige hacia la API
// local a través del proxy configurado en vite.config.js.
// Esto evita el bloqueo de mixed content del navegador (HTTPS → HTTP).
export const API_URL = "/api";
