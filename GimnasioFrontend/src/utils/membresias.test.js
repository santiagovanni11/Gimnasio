// =========================================================
// TESTS DE HELPERS DE DURACIÓN DE MEMBRESÍAS
// mesesEscalonEntre detecta el escalón estándar (1/3/6/12)
// de una membresía existente; sumarMesesIso calcula el nuevo
// vencimiento en horario local. Sostienen la renovación
// rápida (un clic, misma duración).
// =========================================================

import { describe, it, expect } from "vitest";
import { mesesEscalonEntre, sumarMesesIso } from "./membresias";

describe("mesesEscalonEntre", () => {
  it("detecta los escalones estándar", () => {
    expect(mesesEscalonEntre("2026-01-01", "2026-02-01")).toBe("1");
    expect(mesesEscalonEntre("2026-01-01", "2026-04-01")).toBe("3");
    expect(mesesEscalonEntre("2026-01-01", "2026-07-01")).toBe("6");
    expect(mesesEscalonEntre("2026-01-01", "2027-01-01")).toBe("12");
  });

  it("devuelve vacío para duraciones no estándar o inválidas", () => {
    expect(mesesEscalonEntre("2026-01-01", "2026-03-01")).toBe("");
    expect(mesesEscalonEntre("2026-02-01", "2026-01-01")).toBe("");
    expect(mesesEscalonEntre("", "2026-02-01")).toBe("");
    expect(mesesEscalonEntre("2026-01-01", "")).toBe("");
    expect(mesesEscalonEntre("no-fecha", "tampoco")).toBe("");
  });
});

describe("sumarMesesIso", () => {
  it("suma meses manteniendo el día", () => {
    expect(sumarMesesIso("2026-01-15", 1)).toBe("2026-02-15");
    expect(sumarMesesIso("2026-01-15", 12)).toBe("2027-01-15");
  });

  it("devuelve vacío con datos inválidos", () => {
    expect(sumarMesesIso("", 3)).toBe("");
    expect(sumarMesesIso("no-fecha", 3)).toBe("");
    expect(sumarMesesIso("2026-01-15", 0)).toBe("");
  });
});
