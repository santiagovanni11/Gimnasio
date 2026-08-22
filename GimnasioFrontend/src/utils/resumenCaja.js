// =========================================================
// UTILIDADES DE RESUMEN DE CAJA
// Cálculos puros para el panel ResumenCaja (sin JSX).
// =========================================================

import {
  ESTADO_PAGO,
  FORMA_PAGO,
  formaPagoTexto,
  soloAprobados,
} from "./pagos";

const fechaISO = (pago) =>
  pago.fechaPago ? pago.fechaPago.slice(0, 10) : "";

const conFechaValida = (pago) => {
  const fecha = pago.fechaPago ? new Date(pago.fechaPago) : null;
  return fecha && !Number.isNaN(fecha.getTime()) ? fecha : null;
};

export const calcularTotalDelDia = (pagos, fechaHoy) =>
  soloAprobados(pagos)
    .filter((pago) => fechaISO(pago) === fechaHoy)
    .reduce((total, pago) => total + Number(pago.monto || 0), 0);

export const calcularTotalDelMes = (pagos, hoy) =>
  soloAprobados(pagos)
    .filter((pago) => {
      const fecha = conFechaValida(pago);
      return (
        fecha &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );
    })
    .reduce((total, pago) => total + Number(pago.monto || 0), 0);

export const calcularIngresosTotales = (pagos) =>
  soloAprobados(pagos).reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

export const contarPorEstado = (pagos, estado) =>
  pagos.filter((pago) => Number(pago.estado) === estado).length;

export const calcularDesgloseFormaPago = (pagos) =>
  [FORMA_PAGO.EFECTIVO, FORMA_PAGO.DEBITO, FORMA_PAGO.CREDITO].map(
    (forma) => {
      const aprobados = soloAprobados(pagos).filter(
        (pago) => Number(pago.formaPago) === forma
      );

      return {
        forma,
        nombre: formaPagoTexto(forma),
        monto: aprobados.reduce(
          (total, pago) => total + Number(pago.monto || 0),
          0
        ),
        cantidad: aprobados.length,
      };
    }
  );

export const calcularIngresosPorMes = (pagos, hoy) => {
  const meses = [];

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({
      key: `${fecha.getFullYear()}-${fecha.getMonth()}`,
      label: fecha.toLocaleDateString("es-AR", { month: "short" }),
      monto: 0,
    });
  }

  soloAprobados(pagos).forEach((pago) => {
    const fecha = conFechaValida(pago);
    if (!fecha) return;

    const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;
    const mes = meses.find((m) => m.key === key);
    if (mes) mes.monto += Number(pago.monto || 0);
  });

  return meses;
};

export const calcularIngresosPorPlan = (pagos) => {
  const mapa = new Map();

  soloAprobados(pagos).forEach((pago) => {
    const plan =
      String(pago.planNombre || "").trim() || "Sin dato";
    const item = mapa.get(plan) || { plan, monto: 0, cantidad: 0 };
    item.monto += Number(pago.monto || 0);
    item.cantidad += 1;
    mapa.set(plan, item);
  });

  return [...mapa.values()].sort((a, b) => b.monto - a.monto);
};

export const calcularComparativaMensual = (pagos, hoy) => {
  const mesAnterior = new Date(
    hoy.getFullYear(),
    hoy.getMonth() - 1,
    1
  );

  const actual = calcularTotalDelMes(pagos, hoy);
  const previo = calcularTotalDelMes(pagos, mesAnterior);
  const variacion =
    previo > 0 ? ((actual - previo) / previo) * 100 : null;

  return { actual, previo, variacion };
};

export { ESTADO_PAGO };
