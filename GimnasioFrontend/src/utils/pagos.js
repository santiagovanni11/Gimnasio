// =========================================================
// UTILIDADES DE PAGOS
// =========================================================

export const FORMA_PAGO = {
  EFECTIVO: 1,
  TRANSFERENCIA: 2,
  MERCADOPAGO: 3,
  DEBITO: 4,
  CREDITO: 5,
};

export const ESTADO_PAGO = {
  PENDIENTE: 1,
  APROBADO: 2,
  RECHAZADO: 3,
  CANCELADO: 4,
  ANULADO: 5,
};

export const formaPagoTexto = (valor) => {
  const mapa = {
    [FORMA_PAGO.EFECTIVO]: "Efectivo",
    [FORMA_PAGO.TRANSFERENCIA]: "Transferencia",
    [FORMA_PAGO.MERCADOPAGO]: "Mercado Pago",
    [FORMA_PAGO.DEBITO]: "Tarjeta débito",
    [FORMA_PAGO.CREDITO]: "Tarjeta crédito",
  };

  return mapa[Number(valor)] || "Sin dato";
};

export const estadoPagoTexto = (valor) => {
  const mapa = {
    [ESTADO_PAGO.PENDIENTE]: "Pendiente",
    [ESTADO_PAGO.APROBADO]: "Aprobado",
    [ESTADO_PAGO.RECHAZADO]: "Rechazado",
    [ESTADO_PAGO.CANCELADO]: "Cancelado",
    [ESTADO_PAGO.ANULADO]: "Anulado",
  };

  return mapa[Number(valor)] || "Sin dato";
};

export const formatoMoneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(Number(valor || 0));

export const soloAprobados = (pagos = []) =>
  pagos.filter((pago) => Number(pago.estado) === ESTADO_PAGO.APROBADO);

export const esAprobado = (pago) =>
  Number(pago?.estado) === ESTADO_PAGO.APROBADO;

export const esRechazado = (pago) =>
  Number(pago?.estado) === ESTADO_PAGO.RECHAZADO;

export const esCancelado = (pago) =>
  Number(pago?.estado) === ESTADO_PAGO.CANCELADO;

export const esAnulado = (pago) =>
  Number(pago?.estado) === ESTADO_PAGO.ANULADO;

/**
 * Pagos válidos: los que se listan en ingresos (excluye
 * rechazados y cancelados). Misma regla que pagosConFiltros.
 */
export const soloValidos = (pagos = []) =>
  pagos.filter(
    (pago) =>
      !esRechazado(pago) && !esCancelado(pago) && !esAnulado(pago)
  );

/**
 * Mapa membresiaId -> total aprobado acumulado.
 * Base para calcular saldos pendientes.
 */
export const totalAprobadoPorMembresia = (pagos = []) => {
  const mapa = new Map();

  soloAprobados(pagos).forEach((pago) => {
    const id = Number(pago.membresiaId);
    mapa.set(id, (mapa.get(id) || 0) + Number(pago.monto || 0));
  });

  return mapa;
};