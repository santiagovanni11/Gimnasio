// =========================================================
// UTILIDADES DE MEMBRESÍAS
// Estados, saldo pendiente y exportación. La lógica de
// rechazo por período vive en utils/pagosPeriodo.
// =========================================================

import { descargarCsv } from "./exportar/csvComun";
import { aISO, fechaDesdeValor, fechaTexto } from "./fechas";

export const ESTADO_MEMBRESIA = {
  PENDIENTE: 1,
  ACTIVA: 2,
  VENCIDA: 3,
  SUSPENDIDA: 4,
  CANCELADA: 5,
};

/**
 * Escalón de duración (1/3/6/12) entre dos fechas ISO,
 * como string; "" si las fechas son inválidas o no
 * corresponden a un escalón estándar.
 */
export const mesesEscalonEntre = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return "";

  const inicio = fechaDesdeValor(fechaInicio);
  const fin = fechaDesdeValor(fechaFin);

  if ([inicio, fin].some((f) => Number.isNaN(f.getTime()))) {
    return "";
  }

  var diferenciaMeses =
    (fin.getFullYear() - inicio.getFullYear()) * 12 +
    (fin.getMonth() - inicio.getMonth());

  if (fin.getDate() < inicio.getDate()) diferenciaMeses--;

  if (![1, 3, 6, 12].includes(diferenciaMeses)) return "";

  return String(diferenciaMeses);
};

/** Fecha ISO local (yyyy-mm-dd) resultante de sumar meses. */
export const sumarMesesIso = (fechaIso, meses) => {
  const fecha = fechaDesdeValor(fechaIso);
  const diaInicio = fecha.getDate();

  if (Number.isNaN(fecha.getTime()) || !meses) return "";

  fecha.setMonth(fecha.getMonth() + Number(meses));
  if (fecha.getDate() < diaInicio) {
    fecha.setDate(0);
  }

  return aISO(fecha);
};

export const estadoMembresiaTexto = (valor) => {
  const mapa = {
    [ESTADO_MEMBRESIA.PENDIENTE]: "Pendiente",
    [ESTADO_MEMBRESIA.ACTIVA]: "Activa",
    [ESTADO_MEMBRESIA.VENCIDA]: "Vencida",
    [ESTADO_MEMBRESIA.SUSPENDIDA]: "Suspendida",
    [ESTADO_MEMBRESIA.CANCELADA]: "Cancelada",
  };

  return mapa[Number(valor)] || "Desconocida";
};

/**
 * Membresías con saldo pendiente (morosos), excluyendo las
 * rechazadas del período. saldo = precioAplicado - aprobado.
 * @returns {Array<{...membresia, pagado, saldo}>}
 */
export const getMembresiasConSaldoPendiente = (
  membresias = [],
  totalAprobadoDelPeriodo,
  rechazadasIds
) => {
  return membresias
    .filter((m) => Number(m.estado) !== ESTADO_MEMBRESIA.CANCELADA)
    .filter((m) => !rechazadasIds?.has(Number(m.id)))
    .map((m) => {
      const pagado =
        totalAprobadoDelPeriodo.get(Number(m.id)) || 0;
      const saldo = Number(m.precioAplicado || 0) - pagado;
      return { ...m, pagado, saldo };
    })
    .filter((m) => m.saldo > 0);
};

/**
 * Socios sin membresía vigente: excluye a quienes tienen una
 * membresía Activa o Pendiente no rechazada. Las rechazadas
 * quedan disponibles para asignarles una nueva manualmente.
 */
export const sociosSinMembresiaActiva = (
  socios = [],
  membresias = [],
  rechazadasIds
) =>
  socios.filter(
    (socio) =>
      !membresias.some(
        (m) =>
          Number(m.socioId) === Number(socio.id) &&
          (Number(m.estado) === 1 || Number(m.estado) === 2) &&
          !rechazadasIds?.has(Number(m.id))
      )
  );

/**
 * Descarga el listado de membresías como CSV.
 */
export const exportarMembresiasCsv = (membresias = []) => {
  if (!membresias.length) return;

  const encabezados = [
    "Socio",
    "Plan",
    "Precio",
    "Fecha inicio",
    "Vencimiento",
    "Estado",
  ];

  const filas = membresias.map((m) => [
    `${m.socioNombre || ""} ${m.socioApellido || ""}`.trim(),
    m.planNombre,
    m.precioAplicado,
    m.fechaInicio ? fechaTexto(m.fechaInicio) : "",
    m.fechaFin ? fechaTexto(m.fechaFin) : "",
    estadoMembresiaTexto(m.estado),
  ]);

  descargarCsv("membresias", encabezados, filas);
};
