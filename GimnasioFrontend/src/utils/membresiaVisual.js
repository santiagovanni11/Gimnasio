// =========================================================
// membresiaVisual.js — Visualización de la membresía de un socio
// (extraído de utils/socios para mantener archivos enfocados)
// =========================================================

import { estadoMembresiaTexto } from "./membresias";

const CLASES_ESTADO = {
  Activa: "status-active",
  Vigente: "status-active",
  "Por vencer": "status-warning",
  Vencida: "status-expired",
  Pendiente: "status-warning",
};

/** Membresía con fecha fin más lejana (y luego Id mayor). */
const porVigencia = (membresias) =>
  [...membresias].sort(
    (a, b) =>
      new Date(b.fechaFin) - new Date(a.fechaFin) ||
      Number(b.id) - Number(a.id)
  )[0];

/**
 * Visualización de la membresía de un socio.
 * Prioriza la última membresía válida (no rechazada); si el
 * socio tiene membresías pero todas están rechazadas muestra
 * "Rechazada" hasta que registre una nueva con pago aprobado.
 */
export const getMembresiaVisual = (
  socio,
  membresias = [],
  membresiasRechazadasIds
) => {
  const delSocio = membresias.filter(
    (m) => Number(m.socioId) === Number(socio?.id)
  );

  const validas = delSocio.filter(
    (m) => !membresiasRechazadasIds?.has(Number(m.id))
  );

  if (validas.length > 0) {
    const ultima = porVigencia(validas);
    const texto = estadoMembresiaTexto(ultima.estado);

    return {
      texto,
      clase: CLASES_ESTADO[texto] || "status-inactive",
      fechaFin: ultima.fechaFin,
      membresia: ultima,
    };
  }

  if (delSocio.length > 0) {
    const ultima = porVigencia(delSocio);
    return {
      texto: "Rechazada",
      clase: "status-rejected",
      fechaFin: ultima?.fechaFin || null,
      membresia: ultima,
    };
  }

  const estado = socio?.membresia?.estado;
  return {
    texto: estado || "Sin membresía",
    clase: CLASES_ESTADO[estado] || "status-inactive",
    fechaFin: socio?.membresia?.fechaFin || null,
  };
};
