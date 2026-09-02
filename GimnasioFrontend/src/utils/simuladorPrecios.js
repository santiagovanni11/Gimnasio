// =========================================================
// SIMULADOR DE IMPACTO DE CAMBIOS DE PRECIO
// Estima cuántos socios activos afecta una suba y cuánto
// cambiaría la facturación mensual si rigiera hoy.
// =========================================================

import { CAMPOS_ESCALON } from "./preciosConfig";
import { MS_POR_DIA } from "./fechas";

const DIAS_POR_MES = 30.44;

/** Meses completos entre dos fechas ISO (mínimo 1). */
const mesesEntre = (inicio, fin) => {
  const ms = new Date(fin).getTime() - new Date(inicio).getTime();

  if (!Number.isFinite(ms) || ms <= 0) return 0;

  return Math.max(1, Math.round(ms / MS_POR_DIA / DIAS_POR_MES));
};

/** Escalón cuya duración más se acerca a los meses dados. */
const escalonCercano = (meses) =>
  CAMPOS_ESCALON.reduce((mejor, actual) =>
    Math.abs(actual.meses - meses) <
    Math.abs(mejor.meses - meses)
      ? actual
      : mejor
  );

/** Precio que regiría para un escalón: nuevo si fue tocado. */
const precioFuturo = (plan, valoresNuevos, clave) => {
  const editado = valoresNuevos[clave];

  if (editado !== undefined && Number(editado) > 0) {
    return Number(editado);
  }

  return Number(plan[clave] || 0);
};

/**
 * Impacto estimado de los valores en edición sobre las
 * membresías ACTIVAS del plan.
 * @returns {{ afectados:number, diferenciaMensual:number }}
 */
export const calcularImpactoCambio = ({
  plan,
  valoresNuevos = {},
  membresias = [],
}) => {
  const activos = membresias.filter(
    (m) =>
      Number(m.planId) === Number(plan.id) &&
      Number(m.estado) === 2
  );

  let diferenciaMensual = 0;

  activos.forEach((membresia) => {
    const mesesReales = mesesEntre(
      membresia.fechaInicio,
      membresia.fechaFin
    );

    if (!mesesReales) return;

    const escalon = escalonCercano(mesesReales);
    const precioNuevo = precioFuturo(
      plan,
      valoresNuevos,
      escalon.clave
    );

    if (!(precioNuevo > 0)) return;

    const cuotaNueva = precioNuevo / escalon.meses;
    const cuotaActual =
      Number(membresia.precioAplicado || 0) / mesesReales;

    diferenciaMensual += cuotaNueva - cuotaActual;
  });

  return {
    afectados: activos.length,
    diferenciaMensual,
  };
};
