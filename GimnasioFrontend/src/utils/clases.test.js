// =========================================================
// TESTS DE FRANJAS HORARIAS
// horaAMinutos normaliza "HH:mm[:ss]"; franjasSuperponen
// define cuándo dos franjas del mismo día chocan (borde
// compartido NO cuenta). Sostiene la disponibilidad de
// profesores en horarios de clases.
// =========================================================

import { describe, it, expect } from "vitest";
import {
  horaAMinutos,
  franjasSuperponen,
} from "./clases";

describe("horaAMinutos", () => {
  it("convierte HH:mm y HH:mm:ss", () => {
    expect(horaAMinutos("18:00")).toBe(1080);
    expect(horaAMinutos("09:30:45")).toBe(570);
    expect(horaAMinutos("00:00")).toBe(0);
  });

  it("devuelve -1 ante valores inválidos", () => {
    expect(horaAMinutos("")).toBe(-1);
    expect(horaAMinutos("abc")).toBe(-1);
    expect(horaAMinutos(undefined)).toBe(-1);
  });
});

describe("franjasSuperponen", () => {
  it("detecta superposición parcial y total", () => {
    expect(franjasSuperponen("18:00", "20:00", "19:00", "21:00"))
      .toBe(true);
    expect(franjasSuperponen("10:00", "12:00", "11:00", "11:30"))
      .toBe(true);
    // Una contiene a la otra.
    expect(franjasSuperponen("10:00", "14:00", "11:00", "12:00"))
      .toBe(true);
  });

  it("permite bordes compartidos y franjas separadas", () => {
    // Termina exactamente cuando empieza la otra.
    expect(franjasSuperponen("19:00", "20:00", "20:00", "21:00"))
      .toBe(false);
    expect(franjasSuperponen("08:00", "09:00", "10:00", "11:00"))
      .toBe(false);
  });

  it("no explota con horas inválidas (devuelve false)", () => {
    expect(franjasSuperponen("", "", "10:00", "11:00")).toBe(false);
  });
});
