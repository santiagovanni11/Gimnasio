/* preciosConfig - Escalon de precios y equivalencias comerciales */

// =========================================================
// CONFIGURACIÓN DE PRECIOS: escalón y equivalencias
// =========================================================

const CAMPOS_ESCALON = [
  { clave: "precio1Mes", titulo: "1 mes", meses: 1 },
  { clave: "precio3Meses", titulo: "3 meses", meses: 3 },
  { clave: "precio6Meses", titulo: "6 meses", meses: 6 },
  { clave: "precio12Meses", titulo: "12 meses", meses: 12 },
];

/**
 * Valida UNA celda del escalón mientras se edita.
 * Devuelve "" si es válida, o el motivo del error.
 */
export const errorEscalonCelda = (valores = {}, campo) => {
  const indice = CAMPOS_ESCALON.findIndex((c) => c.clave === campo);
  if (indice === -1) return "";

  const valor = Number(valores[campo]);

  if (indice === 0) {
    return valor > 0 ? "" : "Debe ser mayor a cero.";
  }

  const previo = valores[CAMPOS_ESCALON[indice - 1].clave];

  if (!Number.isFinite(Number(previo)) || Number(previo) <= 0) {
    return `Completá primero el precio ${CAMPOS_ESCALON[indice - 1].titulo}.`;
  }

  return valor > Number(previo)
    ? ""
    : `Debe ser mayor al precio de ${CAMPOS_ESCALON[indice - 1].titulo}.`;
};

export { CAMPOS_ESCALON };

/**
 * Cuota mensual equivalente y % de ahorro frente al plan
 * mensual (para destacar el valor del compromiso largo).
 */
export const equivalenciaMensual = (
  precioTotal,
  meses,
  precioBaseMensual
) => {
  const total = Number(precioTotal);
  const base = Number(precioBaseMensual);

  if (!meses || !(total > 0)) {
    return { cuotaTexto: "", ahorroTexto: "" };
  }

  const cuota = Math.round(total / Number(meses));
  const cuotaTexto = `≈ $${cuota.toLocaleString("es-AR")}/mes`;

  let ahorroTexto = "";
  if (base > 0 && meses > 1) {
    const ahorro = Math.round((1 - cuota / base) * 100);
    if (ahorro > 0) ahorroTexto = `−${ahorro}% vs mensual`;
  }

  return { cuotaTexto, ahorroTexto };
};

