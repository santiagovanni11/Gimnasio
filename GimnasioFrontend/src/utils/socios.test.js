// =========================================================
// TESTS DE UTILIDADES DE SOCIOS
// Fija las reglas de membresía vigente y detección de datos
// de contacto incompletos.
// =========================================================

import { describe, it, expect } from "vitest";
import {
  camposFaltantesDe,
  tieneMembresiaVigente,
} from "./socios";

describe("tieneMembresiaVigente", () => {
  const socio = (estado) => ({
    membresia: { id: 7, estado },
  });

  it("es vigente cuando la última está Vigente o Por vencer", () => {
    expect(tieneMembresiaVigente(socio("Vigente"))).toBe(true);
    expect(tieneMembresiaVigente(socio("Por vencer"))).toBe(true);
  });

  it("no es vigente si está vencida, rechazada o no existe", () => {
    const vencida = socio("Vencida");
    const rechazada = socio("Vigente");

    expect(tieneMembresiaVigente(vencida)).toBe(false);
    expect(
      tieneMembresiaVigente(rechazada, new Set([7]))
    ).toBe(false);
    expect(tieneMembresiaVigente({})).toBe(false);
  });
});

describe("camposFaltantesDe", () => {
  it("lista los campos de contacto vacíos", () => {
    const faltantes = camposFaltantesDe({
      telefono: "3515551234",
      email: "   ",
      direccion: null,
    });

    expect(faltantes).toEqual(["email", "dirección"]);
  });

  it("no reporta nada si el socio está completo", () => {
    const completo = {
      telefono: "3515551234",
      email: "socio@gym.com",
      direccion: "Av. Colón 123",
    };

    expect(camposFaltantesDe(completo)).toEqual([]);
  });

  it("tolera socios sin ninguna propiedad", () => {
    expect(camposFaltantesDe({})).toEqual([
      "teléfono",
      "email",
      "dirección",
    ]);
  });
});
