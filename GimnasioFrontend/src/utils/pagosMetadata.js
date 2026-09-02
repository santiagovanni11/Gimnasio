import { ESTADO_PAGO, formaPagoTexto } from "./pagos";

const KEY = "gimnasio-pagos-meta-v1";

const leerMeta = () => {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    return {};
  }
};

const guardarMeta = (meta) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(meta));
};

export const auditoriaPagos = (id) => {
  const meta = leerMeta();
  return Array.isArray(meta[Number(id)]) ? meta[Number(id)] : [];
};

export const registrarEventoPago = (pago, accion, detalle, usuario = "Sistema") => {
  const id = Number(pago?.id);
  const meta = leerMeta();
  const eventos = Array.isArray(meta[id]) ? meta[id] : [];

  eventos.unshift({
    id: Date.now(),
    accion,
    detalle,
    usuario,
    fecha: new Date().toISOString(),
  });

  meta[id] = eventos.slice(0, 10);
  guardarMeta(meta);
  return meta[id];
};

export const resumenPagosAuditoria = (pagos = []) => {
  return pagos.slice(0, 5).map((pago) => ({
    pago,
    eventos: auditoriaPagos(pago.id),
  }));
};

export const conciliacionPagos = (pagos = []) => {
  const aprobados = pagos.filter((pago) => Number(pago.estado) === ESTADO_PAGO.APROBADO);
  const rechazados = pagos.filter((pago) => Number(pago.estado) === ESTADO_PAGO.RECHAZADO);
  const pendientes = pagos.filter((pago) => Number(pago.estado) === ESTADO_PAGO.PENDIENTE);

  const porForma = Object.fromEntries(
    Object.keys({ 1: "Efectivo", 4: "Débito", 5: "Crédito" }).map((key) => [
      key,
      aprobados
        .filter((pago) => Number(pago.formaPago) === Number(key))
        .reduce((sum, pago) => sum + Number(pago.monto || 0), 0),
    ])
  );

  return {
    aprobados: aprobados.length,
    rechazados: rechazados.length,
    pendientes: pendientes.length,
    total: aprobados.reduce((sum, pago) => sum + Number(pago.monto || 0), 0),
    formas: Object.fromEntries(
      Object.entries(porForma).map(([key, monto]) => [formaPagoTexto(key), monto])
    ),
  };
};
