// =========================================================
// UTILIDADES DE TEXTO
// Normalización para búsquedas insibles a acentos/mayúsculas.
// =========================================================

export const quitarAcentos = (valor = "") =>
  valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const normalizarTextoBusqueda = (valor = "") =>
  quitarAcentos(String(valor)).toLowerCase().trim();
