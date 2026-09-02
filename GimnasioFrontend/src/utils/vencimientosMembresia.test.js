// =========================================================
// TESTS DE CHIP DE VENCIMIENTO
// Fija la regla visual del listado de membresías: toda
// activa a 30 días o menos muestra chip junto al vencimiento
// ("30 días"…"vence hoy"); otros estados no muestran chip.
// =========================================================

import { describe, it, expect } from "vitest";
import { chipVencimiento, diasParaVencer } from "./vencimientosMembresia";

const fechaEn = (dias) => {
  // yyyy-mm-dd en horario LOCAL (misma política que fechas.js):
  // toISOString usaría UTC y correría el día después de las 21h.
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

const membresia = (estado, dias) => ({ estado, fechaFin: fechaEn(dias) });

describe("chipVencimiento", () => {
  it("activa a 30/29 días muestra chip amarillo con la cantidad", () => {
    const treinta = chipVencimiento(membresia(2, 30));
    const veintinueve = chipVencimiento(membresia(2, 29));

    expect(treinta).toEqual({
      texto: "30 días",
      clase: "status-warning",
    });
    expect(veintinueve.texto).toBe("29 días");
    expect(veintinueve.clase).toBe("status-warning");
  });

  it("activa a 7 días o menos muestra chip rojo", () => {
    const siete = chipVencimiento(membresia(2, 7));

    expect(siete).toEqual({
      texto: "7 días",
      clase: "status-blocked",
    });
    expect(chipVencimiento(membresia(2, 1)).texto).toBe("vence mañana");
    expect(chipVencimiento(membresia(2, 0)).texto).toBe("vence hoy");
  });

  it("fuera de la ventana (más de 30 días o ya pasada) no hay chip", () => {
    expect(chipVencimiento(membresia(2, 31))).toBeNull();
    expect(chipVencimiento(membresia(2, -3))).toBeNull();
  });

  it("estados no activos no muestran chip aunque estén por vencer", () => {
    expect(chipVencimiento(membresia(1, 5))).toBeNull(); // Pendiente
    expect(chipVencimiento(membresia(4, 5))).toBeNull(); // Suspendida
    expect(chipVencimiento(membresia(5, 5))).toBeNull(); // Cancelada
  });
});

describe("diasParaVencer", () => {
  it("calcula días completos hasta la fecha de fin", () => {
    expect(diasParaVencer(fechaEn(10))).toBe(10);
    expect(diasParaVencer(fechaEn(0))).toBe(0);
    expect(diasParaVencer(fechaEn(-2))).toBe(-2);
  });
});
