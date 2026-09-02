// =========================================================
// TESTS DE PERÍODOS DE PAGOS
// Fija la regla clave: un pago hecho el MISMO DÍA del alta o
// renovación pertenece al período vigente (comparación por
// día calendario), y los pagos previos a una renovación no.
// =========================================================

import { describe, it, expect } from "vitest";
import {
  getMembresiasRechazadasIds,
  totalAprobadoDelPeriodoPorMembresia,
} from "./pagosPeriodo";

const membresia = (id, ultimaRenovacion = null) => ({
  id,
  ultimaRenovacion,
});

const pago = (membresiaId, estado, fechaPago) => ({
  membresiaId,
  estado,
  fechaPago,
});

describe("getMembresiasRechazadasIds", () => {
  it("marca como rechazada una membresía con solo un pago rechazado del mismo día del alta", () => {
    const membresias = [membresia(1, "2026-08-22T14:30:00")];
    const pagos = [pago(1, 3, "2026-08-22")];

    expect(getMembresiasRechazadasIds(pagos, membresias)).toEqual(
      new Set([1])
    );
  });

  it("no marca rechazada si el período tiene al menos un aprobado", () => {
    const membresias = [membresia(2, "2026-08-22T09:00:00")];
    const pagos = [
      pago(2, 3, "2026-08-22"),
      pago(2, 2, "2026-08-22"),
    ];

    expect(getMembresiasRechazadasIds(pagos, membresias)).toEqual(
      new Set()
    );
  });

  it("borra la marca de rechazada cuando ese rechazo luego se aprueba", () => {
    const membresias = [membresia(2, "2026-08-22T09:00:00")];
    const pagos = [
      pago(2, 3, "2026-08-22"),
      pago(2, 2, "2026-08-22"),
    ];

    expect(getMembresiasRechazadasIds(pagos, membresias)).toEqual(new Set());
    expect(getMembresiasRechazadasIds([pago(2, 2, "2026-08-22")], membresias)).toEqual(new Set());
  });

  it("marca como rechazada cuando el último intento del período quedó rechazado", () => {
    const membresias = [membresia(99, "2026-08-22T09:00:00")];
    const pagos = [
      pago(99, 2, "2026-08-22"),
      pago(99, 3, "2026-08-23"),
    ];

    expect(getMembresiasRechazadasIds(pagos, membresias)).toEqual(new Set([99]));
  });

  it("un pago anterior a la renovación no cuenta en el período nuevo", () => {
    const membresias = [membresia(3, "2026-09-01T10:00:00")];
    const pagos = [
      // Aprobado del ciclo anterior y rechazado de la renovación.
      pago(3, 2, "2026-08-15"),
      pago(3, 3, "2026-09-01"),
    ];

    expect(getMembresiasRechazadasIds(pagos, membresias)).toEqual(
      new Set([3])
    );
  });

  it("sin sello (alta legacy) cuentan todos los pagos", () => {
    const membresias = [membresia(4)];
    const pagos = [pago(4, 3, "2026-01-10")];

    expect(getMembresiasRechazadasIds(pagos, membresias)).toEqual(
      new Set([4])
    );
  });
});

describe("totalAprobadoDelPeriodoPorMembresia", () => {
  it("suma solo los aprobados del día del alta o posteriores", () => {
    const membresias = [membresia(5, "2026-08-22T14:30:00")];
    const pagos = [
      pago(5, 2, "2026-08-21"),
      { ...pago(5, 2, "2026-08-22"), monto: 100 },
      { ...pago(5, 3, "2026-08-23"), monto: 999 },
    ];

    const mapa = totalAprobadoDelPeriodoPorMembresia(
      pagos,
      membresias
    );

    // El pago previo al alta y el rechazado no suman.
    expect(mapa.get(5)).toBe(100);
  });
});
