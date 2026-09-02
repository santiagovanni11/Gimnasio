import { describe, it, expect } from "vitest";
import { metodosDesdePagos } from "./metodosDesdePagos.js";

const pagoDebito = (extra = {}) => ({
  id: 1,
  socioId: 10,
  formaPago: 4,
  estado: 2,
  referencia: "Visa - Juan Perez - ****4242",
  observaciones: "Titular: Juan Perez | Vencimiento: 12/27 | Marca: Visa",
  ...extra,
});

describe("metodosDesdePagos", () => {
  it("deriva una tarjeta de un pago con débito aprobado", () => {
    const resultado = metodosDesdePagos([pagoDebito()]);
    expect(resultado).toEqual([
      { marca: "Visa", ultimosCuatro: "4242", mesVencimiento: 12, anioVencimiento: 2027 },
    ]);
  });

  it("deriva crédito igual que débito", () => {
    const resultado = metodosDesdePagos([
      pagoDebito({ formaPago: 5, referencia: "Mastercard - A - ****1234", observaciones: "Marca: Mastercard | Vencimiento: 05/28" }),
    ]);
    expect(resultado).toEqual([
      { marca: "Mastercard", ultimosCuatro: "1234", mesVencimiento: 5, anioVencimiento: 2028 },
    ]);
  });

  it("ignora pagos en efectivo o transferencia", () => {
    const resultado = metodosDesdePagos([
      pagoDebito({ formaPago: 1 }),
      pagoDebito({ formaPago: 2 }),
      pagoDebito({ formaPago: 3 }),
    ]);
    expect(resultado).toEqual([]);
  });

  it("ignora pagos rechazados", () => {
    const resultado = metodosDesdePagos([pagoDebito({ estado: 3 })]);
    expect(resultado).toEqual([]);
  });

  it("deduplica tarjetas iguales", () => {
    const resultado = metodosDesdePagos([pagoDebito(), pagoDebito({ id: 2 })]);
    expect(resultado).toHaveLength(1);
  });

  it("devuelve vacío para tarjeta sin vencimiento o sin referencia", () => {
    expect(metodosDesdePagos([pagoDebito({ observaciones: "Marca: Visa" })])).toEqual([]);
    expect(metodosDesdePagos([pagoDebito({ referencia: "" })])).toEqual([]);
    expect(metodosDesdePagos([])).toEqual([]);
  });
});
