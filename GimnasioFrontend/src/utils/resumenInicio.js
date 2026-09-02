// =========================================================
// RESUMEN DEL INICIO — Cálculos puros sobre los dominios.
// Separado de la presentación para mantener los componentes
// pequeños y testeables. Reusa utilidades de pagos/asistencias.
// =========================================================

import { soloAprobados, formatoMoneda } from "./pagos";
import { enVentanaDeVencimiento } from "./vencimientosMembresia";
import { asistenciasEnFecha } from "./asistencias";
import { aISO, MS_POR_DIA, fechaDesdeValor } from "./fechas";

const claveMes = (valor) => {
  const d = fechaDesdeValor(valor);
  return `${d.getFullYear()}-${d.getMonth()}`;
};

/**
 * Total de ingresos de un mes. Solo cuentan pagos APROBADOS
 * (dinero realmente recibido, igual que el resto del sistema):
 * excluye pendientes, rechazados, cancelados y anulados.
 * El mes se calcula sobre la fecha LOCAL para no correr pagos
 * de inicios de mes hacia el mes anterior por el desfase UTC.
 */
export const ingresosDeMes = (pagos, ref = new Date()) => {
  const clave = claveMes(ref);
  return soloAprobados(pagos)
    .filter((p) => claveMes(p.fechaPago) === clave)
    .reduce((total, p) => total + Number(p.monto || 0), 0);
};

/** Variación % de ingresos del mes actual vs. el anterior. */
export const tendenciaIngresos = (pagos) => {
  const hoy = new Date();
  const actual = ingresosDeMes(pagos, hoy);
  const prev = ingresosDeMes(
    pagos,
    new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
  );

  if (!prev) return null;

  const pct = Math.round(((actual - prev) / prev) * 100);
  return { pct: Math.abs(pct), dir: pct >= 0 ? "up" : "down" };
};

/** Serie de ingresos de los últimos 6 meses para el gráfico. */
export const serieIngresos6Meses = (pagos) => {
  const nombres = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  const hoy = new Date();
  const salida = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    salida.push({ mes: nombres[d.getMonth()], total: ingresosDeMes(pagos, d) });
  }

  return salida;
};

/** Membresías activas que vencen dentro de la ventana (días). */
export const membresiasPorVencer = (membresias, dias = 7) =>
  membresias.filter((m) => enVentanaDeVencimiento(m, dias));

/** Cantidad de asistencias de una fecha (hoy por defecto). */
export const conteoAsistencias = (asistencias, iso = aISO(new Date())) =>
  asistenciasEnFecha(asistencias, iso).length;

/** ISO de ayer (comparación de tendencia de asistencias). */
export const ayerISO = () => aISO(new Date(Date.now() - MS_POR_DIA));

export { formatoMoneda };
