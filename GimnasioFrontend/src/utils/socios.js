// =========================================================
// UTILIDADES DE SOCIOS
// Cumpleaños, vencimientos próximos y contacto faltante.
// La visualización de membresía vive en utils/membresiaVisual.
// La exportación a CSV está en utils/exportar/sociosExportarCsv.
// =========================================================

import { aISO } from "./fechas";

export { getMembresiaVisual } from "./membresiaVisual";

/**
 * Socios activos que cumplen años en el mes actual,
 * ordenados por día.
 */
export const getCumpleanosDelMes = (socios = [], hoy = new Date()) => {
  const mesActual = hoy.getMonth();

  return socios
    .filter((socio) => socio.activo !== false)
    .filter((socio) => {
      if (!socio.fechaNacimiento) return false;
      const fecha = new Date(socio.fechaNacimiento);
      return !Number.isNaN(fecha.getTime()) && fecha.getMonth() === mesActual;
    })
    .sort((a, b) => {
      const diaA = new Date(a.fechaNacimiento).getDate();
      const diaB = new Date(b.fechaNacimiento).getDate();
      return diaA - diaB;
    });
};

/**
 * Membresías que vencen exactamente en `dias` días
 * (por defecto mañana). Excluye las rechazadas.
 */
export const getVencimientosProximos = (
  membresias = [],
  membresiasRechazadasIds,
  dias = 1,
  hoy = new Date()
) => {
  const limite = new Date(hoy);
  limite.setDate(limite.getDate() + dias);

  const limiteISO = aISO(limite);

  return membresias.filter(
    (m) =>
      !membresiasRechazadasIds?.has(Number(m.id)) &&
      (m.fechaFin || "").slice(0, 10) === limiteISO
  );
};

/**
 * ¿El socio tiene membresía vigente? La última membresía debe
 * estar en curso (Vigente o Por vencer) y no rechazada.
 */
export const tieneMembresiaVigente = (socio, membresiasRechazadasIds) => {
  const membresia = socio?.membresia;

  if (!membresia) return false;
  if (membresiasRechazadasIds?.has(Number(membresia.id))) return false;

  return (
    membresia.estado === "Vigente" || membresia.estado === "Por vencer"
  );
};

/** Campos de contacto opcionales que debería tener un socio. */
const CAMPOS_CONTACTO = [
  { clave: "telefono", titulo: "teléfono" },
  { clave: "email", titulo: "email" },
  { clave: "direccion", titulo: "dirección" },
];

/**
 * Datos de contacto faltantes del socio, para el indicador
 * de ficha incompleta ("teléfono", "email"…).
 */
export const camposFaltantesDe = (socio) =>
  CAMPOS_CONTACTO.filter(
    ({ clave }) => !String(socio?.[clave] ?? "").trim()
  ).map(({ titulo }) => titulo);
