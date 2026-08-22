import { describe, it, expect } from "vitest";
import {
  parseVencimiento,
  estaVencida,
  validarLuhn,
  validarTarjeta,
  prefijoCorrespondeConMarca,
} from "./tarjeta.js";

describe("parseVencimiento", () => {
  it("acepta MM/AA", () => {
    const r = parseVencimiento("12/30");
    expect(r).toEqual({ valido: true, mes: 12, anio: 2030 });
  });

  it("acepta MM/AAAA", () => {
    const r = parseVencimiento("03/2031");
    expect(r).toEqual({ valido: true, mes: 3, anio: 2031 });
  });

  it("rechaza formato inválido", () => {
    expect(parseVencimiento("13/2030").valido).toBe(false);
    expect(parseVencimiento("00/2030").valido).toBe(false);
    expect(parseVencimiento("12-30").valido).toBe(false);
    expect(parseVencimiento("").valido).toBe(false);
    expect(parseVencimiento(null).valido).toBe(false);
  });
});

describe("estaVencida", () => {
  it("tarjeta inválida se considera vencida", () => {
    expect(estaVencida("abc")).toBe(true);
  });

  it("año pasado está vencida", () => {
    expect(estaVencida(`01/${new Date().getFullYear() - 1}`)).toBe(true);
  });

  it("mes anterior del año actual está vencida", () => {
    const hoy = new Date();
    const mesAnterior = String(hoy.getMonth() || 12).padStart(2, "0");
    const anio = hoy.getMonth() === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear();
    expect(estaVencida(`${mesAnterior}/${anio}`)).toBe(true);
  });

  it("mes actual o futuro no está vencida", () => {
    const hoy = new Date();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    expect(estaVencida(`${mm}/${hoy.getFullYear()}`)).toBe(false);
    expect(estaVencida(`${mm}/${hoy.getFullYear() + 1}`)).toBe(false);
  });
});

describe("validarLuhn", () => {
  it("número válido pasa", () => {
    expect(validarLuhn("4539578763621486")).toBe(true);
    expect(validarLuhn("4539 5787 6362 1486")).toBe(true);
  });

  it("dígito verificador incorrecto falla", () => {
    expect(validarLuhn("4539578763621487")).toBe(false);
  });

  it("vacío o sin dígitos falla", () => {
    expect(validarLuhn("")).toBe(false);
    expect(validarLuhn(null)).toBe(false);
  });
});

describe("prefijoCorrespondeConMarca", () => {
  it("visa empieza con 4", () => {
    expect(prefijoCorrespondeConMarca("4539578763621486", "visa")).toBe(true);
    expect(prefijoCorrespondeConMarca("5236258961548903", "visa")).toBe(false);
  });

  it("mastercard empieza con 51-55 o 22-27", () => {
    expect(prefijoCorrespondeConMarca("5236258961548903", "mastercard")).toBe(true);
    expect(prefijoCorrespondeConMarca("2720998512345677", "mastercard")).toBe(true);
    expect(prefijoCorrespondeConMarca("4539578763621486", "mastercard")).toBe(false);
  });

  it("amex empieza con 34 o 37", () => {
    expect(prefijoCorrespondeConMarca("374245455400126", "amex")).toBe(true);
    expect(prefijoCorrespondeConMarca("341111111111111", "amex")).toBe(true);
    expect(prefijoCorrespondeConMarca("361111111111117", "amex")).toBe(false);
  });

  it("sin número no rechaza", () => {
    expect(prefijoCorrespondeConMarca("", "visa")).toBe(true);
  });
});

describe("validarTarjeta", () => {
  const visaValida = {
    numeroTarjeta: "4539578763621486",
    titular: "Juan Perez",
    vencimiento: `12/${new Date().getFullYear() + 1}`,
    cvv: "123",
    marca: "visa",
  };

  it("tarjeta completa válida", () => {
    const r = validarTarjeta(visaValida);
    expect(r.esValida).toBe(true);
  });

  it("cvv de amex requiere 4 dígitos", () => {
    const r = validarTarjeta({
      ...visaValida,
      marca: "amex",
      numeroTarjeta: "374245455400126",
      cvv: "1234",
    });
    expect(r.cvvOk).toBe(true);
    expect(r.esValida).toBe(true);
  });

  it("titular corto es rechazado", () => {
    const r = validarTarjeta({ ...visaValida, titular: "A" });
    expect(r.titularOk).toBe(false);
    expect(r.esValida).toBe(false);
  });

  it("vencida es rechazada", () => {
    const r = validarTarjeta({
      ...visaValida,
      vencimiento: `01/${new Date().getFullYear() - 1}`,
    });
    expect(r.vencida).toBe(true);
    expect(r.vencimientoOk).toBe(false);
    expect(r.esValida).toBe(false);
  });
});
