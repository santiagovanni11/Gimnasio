// =========================================================
// edicionPrecios.js — Helpers puros de edición de precios
// =========================================================

/** Normaliza los campos de un plan a números. */
export function preciosANumericos(precios) {
  return {
    precio1Mes: Number(precios.precio1Mes),
    precio3Meses: Number(precios.precio3Meses),
    precio6Meses: Number(precios.precio6Meses),
    precio12Meses: Number(precios.precio12Meses),
  };
}

/** Arma el texto de confirmación para saltos de precio >20%. */
export function construirMensajeSaltos(saltos) {
  return "Estás por aplicar cambios importantes:\n\n" + saltos.join("\n");
}

/** Mensaje final según guardado inmediato o programado. */
export function mensajeResultadoPrecios(resultado) {
  if (resultado.datos?.programado && resultado.datos?.vigenteDesde) {
    const fecha = new Date(resultado.datos.vigenteDesde).toLocaleDateString(
      "es-AR"
    );
    return `Cambios programados: rigen desde el ${fecha}.`;
  }
  return "Precios actualizados correctamente.";
}
