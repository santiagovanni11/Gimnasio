// =========================================================
// TESTS DE MÉTRICAS DE ASISTENCIA
// Rango de fechas, filtrado por rango y cálculo de tasa por
// horario. Sostienen el panel "Asistencia por horario".
// =========================================================

import { describe, it, expect } from "vitest";
import {
  rangoUltimosDias,
  enRango,
  claseTasaAsistencia,
  resumenAsistenciaPorHorario,
} from "./metricasAsistencias";

describe("rangoUltimosDias", () => {
  it("incluye hoy y va hacia atrás N días", () => {
    const hoy = new Date(2026, 7, 25); // local: 2026-08-25
    const rango = rangoUltimosDias(7, hoy);

    expect(rango).toEqual({
      desde: "2026-08-19",
      hasta: "2026-08-25",
    });
  });
});

describe("enRango", () => {
  const rango = { desde: "2026-08-01", hasta: "2026-08-31" };

  it("acepta bordes inclusivos y descarta fuera de rango", () => {
    expect(enRango("2026-08-01T10:00:00", rango)).toBe(true);
    expect(enRango("2026-08-15", rango)).toBe(true);
    expect(enRango("2026-08-31T23:00:00", rango)).toBe(true);
    expect(enRango("2026-07-31", rango)).toBe(false);
    expect(enRango("2026-09-01", rango)).toBe(false);
  });
});

describe("claseTasaAsistencia", () => {
  it("colorea según umbrales 80/50", () => {
    expect(claseTasaAsistencia(null)).toBe("");
    expect(claseTasaAsistencia(0.9)).toBe("status-active");
    expect(claseTasaAsistencia(0.6)).toBe("status-warning");
    expect(claseTasaAsistencia(0.3)).toBe("status-rejected");
  });
});

describe("resumenAsistenciaPorHorario", () => {
  const base = {
    clases: [{ id: 1, nombre: "Spinning", capacidadMaxima: 2 }],
    horarios: [
      { id: 10, claseId: 1, diaSemana: 1 },
      { id: 11, claseId: 1, diaSemana: 3 },
    ],
    inscripciones: [
      { id: 100, socioId: 1, horarioClaseId: 10, estado: 2 },
      { id: 101, socioId: 2, horarioClaseId: 10, estado: 4 },
      { id: 102, socioId: 3, horarioClaseId: 11, estado: 2 },
    ],
    desde: "2026-08-01",
    hasta: "2026-08-31",
  };

  it("cuenta solo inscripciones vigentes y marcas del rango", () => {
    const filas = resumenAsistenciaPorHorario({
      ...base,
      asistencias: [
        // Horario 10 (inscripción 100): 1 presente + 1 ausente.
        { inscripcionClaseId: 100, fecha: "2026-08-03T00:00:00", presente: true },
        { inscripcionClaseId: 100, fecha: "2026-08-10T00:00:00", presente: false },
        // Fuera de rango: no cuenta.
        { inscripcionClaseId: 100, fecha: "2026-07-20T00:00:00", presente: true },
        // Inscripción cancelada (101): su marca no se asocia al cupo.
        { inscripcionClaseId: 101, fecha: "2026-08-05T00:00:00", presente: true },
      ],
    });

    // El horario 11 no tiene marcas → no aparece.
    expect(filas).toHaveLength(1);

    const fila = filas[0];
    expect(fila.horario.id).toBe(10);
    expect(fila.inscriptos).toBe(1); // la cancelada no ocupa cupo
    expect(fila.marcas).toBe(2);
    expect(fila.presentes).toBe(1);
    expect(fila.ausentes).toBe(1);
    expect(fila.tasa).toBeCloseTo(0.5);
  });

  it("ordena por tasa ascendente (peor primero)", () => {
    const filas = resumenAsistenciaPorHorario({
      ...base,
      asistencias: [
        { inscripcionClaseId: 100, fecha: "2026-08-03", presente: false },
        { inscripcionClaseId: 100, fecha: "2026-08-10", presente: true },
        { inscripcionClaseId: 102, fecha: "2026-08-05", presente: true },
      ],
    });

    expect(filas.map((f) => f.horario.id)).toEqual([10, 11]);
    expect(filas[0].tasa).toBeCloseTo(0.5);
    expect(filas[1].tasa).toBe(1);
  });
});
