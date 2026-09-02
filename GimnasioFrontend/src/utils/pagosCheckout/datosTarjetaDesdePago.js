// =========================================================
// RECONSTRUCCIÓN DE TARJETA DESDE UN PAGO
// Al editar un cobro con tarjeta, el formulario se precarga
// con los datos parciales que quedaron grabados en la
// referencia y observaciones del pago (el número completo y
// el CVV no se persisten por seguridad).
// =========================================================

const ultimosCuatroDe = (referencia = "") => {
  const match = String(referencia).match(/\*{4}(\d{4})/);
  return match ? match[1] : "";
};

const valorDe = (obs, campo) => {
  const match = String(obs || "").match(
    new RegExp(`${campo}:\\s*([^|]+?)(?:\\s*\\||$)`)
  );
  return match ? match[1].trim() : "";
};

const marcaDe = (pago = {}) => {
  const deObs = valorDe(pago.observaciones, "Marca");
  if (deObs) return deObs;
  return String(pago.referencia || "").trim().split(/[-|]/)[0]?.trim() || "";
};

const titularDe = (pago = {}) => {
  const deObs = valorDe(pago.observaciones, "Titular");
  if (deObs) return deObs;
  const partes = String(pago.referencia || "").split(" - ");
  return partes.length >= 3 && partes[1] ? partes[1] : "";
};

/**
 * Devuelve { marcaTarjeta, titularTarjeta, vencimientoTarjeta,
 * numeroTarjeta } precargables desde un pago con tarjeta.
 * El número solo conserva los últimos 4 dígitos.
 */
export function datosTarjetaDesdePago(pago = {}) {
  const vencimiento = valorDe(pago.observaciones, "Vencimiento");
  return {
    marcaTarjeta: marcaDe(pago) || "Visa",
    titularTarjeta: titularDe(pago),
    vencimientoTarjeta: vencimiento || "",
    numeroTarjeta: ultimosCuatroDe(pago.referencia),
  };
}
