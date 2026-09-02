// =========================================================
// PERSISTENCIA DE TARJETA AL COBRAR
// Al registrar un cobro con tarjeta aprobado, guarda el método
// de pago del socio para poder reutilizarlo en la renovación
// automática. Es un paso complementario: si falla no bloquea
// el pago ya registrado.
// =========================================================

import { FORMA_PAGO, ESTADO_PAGO } from "../pagos";
import { parseVencimiento } from "../tarjeta";
import { determinarEstadoAutomatico } from "./validacionesTarjeta";
import { metodosPagoService } from "../../services/metodosPagoService";

const esTarjeta = (formaPago) =>
  [String(FORMA_PAGO.DEBITO), String(FORMA_PAGO.CREDITO)].includes(
    String(formaPago)
  );

const ultimosCuatro = (numero) =>
  String(numero || "").replace(/\D/g, "").slice(-4);

/**
 * Resuelve el socioId de una membresía (para vincular el método).
 */
const socioDeMembresia = (membresias = [], membresiaId) => {
  const membresia = membresias.find(
    (m) => String(m.id) === String(membresiaId)
  );
  return membresia?.socioId ?? null;
};

/**
 * Registra la tarjeta como método almacenado del socio cuando
 * corresponde (pago con tarjeta aprobado). Devuelve la promesa
 * sin propagar errores.
 */
export const persistirMetodoPagoSiCorresponde = (
  formPago,
  membresias = []
) => {
  const esAprobado =
    determinarEstadoAutomatico(formPago) === ESTADO_PAGO.APROBADO;

  if (!esTarjeta(formPago.formaPago) || !esAprobado) {
    return Promise.resolve(false);
  }

  const socioId = socioDeMembresia(membresias, formPago.membresiaId);
  const venc = parseVencimiento(formPago.vencimientoTarjeta);
  const marca = String(formPago.marcaTarjeta || "").trim();
  const ultimos = ultimosCuatro(formPago.numeroTarjeta);

  if (!socioId || !venc.valido || ultimos.length !== 4 || !marca) {
    return Promise.resolve(false);
  }

  return metodosPagoService
    .crear({
      socioId,
      marca,
      ultimosCuatro: ultimos,
      mesVencimiento: venc.mes,
      anioVencimiento: venc.anio,
    })
    .then(() => true)
    .catch(() => false);
};
