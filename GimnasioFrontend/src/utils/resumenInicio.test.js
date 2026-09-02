// =========================================================
// TESTS DE RESUMEN DEL INICIO — INGRESOS
// Asegura que el gráfico/KPI de ingresos cuente solo pagos
// APROBADOS (dinero recibido) y agrupe por la fecha LOCAL.
// =========================================================

import { describe, it, expect } from "vitest";
import { ingresosDeMes, serieIngresos6Meses } from "./resumenInicio";

const pago = (overrides = {}) => ({
  id: 1,
  monto: 100000,
  estado: 2, // APROBADO
  fechaPago: "2026-09-01T00:00:00",
  ...overrides,
});

describe("ingresosDeMes", () => {
  it("cuenta solo pagos aprobados, ignorando pendientes", () => {
    const pagos = [
      pago({ id: 1, estado: 2, monto: 100000 }), // aprobado
      pago({ id: 2, estado: 1, monto: 100000 }), // pendiente
      pago({ id: 3, estado: 1, monto: 100000 }), // pendiente
    ];

    const ref = new Date(2026, 8, 15); // septiembre 2026
    expect(ingresosDeMes(pagos, ref)).toBe(100000);
  });

  it("agrupa por mes con la fecha local (no corre el día por UTC)", () => {
    // Fecha de fin de mes del 31-agosto, que en UTC-3 no debe saltar
    // a septiembre al formatear.
    const pagos = [
      pago({ monto: 50000, fechaPago: "2026-08-31T00:00:00" }),
      pago({ monto: 25000, fechaPago: "2026-09-01T00:00:00" }),
    ];

    const agosto = new Date(2026, 7, 15);
    const septiembre = new Date(2026, 8, 15);

    expect(ingresosDeMes(pagos, agosto)).toBe(50000);
    expect(ingresosDeMes(pagos, septiembre)).toBe(25000);
  });

  it("no cuenta rechazados, cancelados ni anulados", () => {
    const pagos = [
      pago({ id: 1, estado: 2, monto: 60000 }),
      pago({ id: 2, estado: 3, monto: 90000 }), // rechazado
      pago({ id: 3, estado: 4, monto: 90000 }), // cancelado
      pago({ id: 4, estado: 5, monto: 90000 }), // anulado
    ];

    const ref = new Date(2026, 8, 15);
    expect(ingresosDeMes(pagos, ref)).toBe(60000);
  });
});

describe("serieIngresos6Meses", () => {
  it("devuelve 6 meses y respeta la suma de aprobados de cada uno", () => {
    const ahora = new Date();
    const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
    const mesAnteriorDate = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const mesAnterior = `${mesAnteriorDate.getFullYear()}-${String(mesAnteriorDate.getMonth() + 1).padStart(2, "0")}`;

    const pagos = [
      pago({ monto: 100000, fechaPago: `${mesActual}-01T00:00:00` }),
      pago({ estado: 1, monto: 200000, fechaPago: `${mesActual}-10T00:00:00` }),
      pago({ monto: 50000, fechaPago: `${mesAnterior}-01T00:00:00` }),
    ];

    const serie = serieIngresos6Meses(pagos);

    expect(serie).toHaveLength(6);

    const ultimo = serie[serie.length - 1]; // mes actual
    expect(ultimo.total).toBe(100000);

    const antepenultimo = serie[serie.length - 2]; // mes anterior
    expect(antepenultimo.total).toBe(50000);
  });
});
