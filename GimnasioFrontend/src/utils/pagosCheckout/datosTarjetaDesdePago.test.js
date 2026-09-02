import { describe, it, expect } from "vitest";
import { datosTarjetaDesdePago } from "./datosTarjetaDesdePago.js";

describe("datosTarjetaDesdePago", () => {
  it("reconstruye marca, titular, vencimiento y últimos 4", () => {
    const pago = {
      formaPago: 4,
      referencia: "Visa - Juan Perez - ****4242",
      observaciones: "Titular: Juan Perez | Vencimiento: 12/27 | Marca: Visa",
    };
    expect(datosTarjetaDesdePago(pago)).toEqual({
      marcaTarjeta: "Visa",
      titularTarjeta: "Juan Perez",
      vencimientoTarjeta: "12/27",
      numeroTarjeta: "4242",
    });
  });

  it("toma del pago sin titular en la referencia", () => {
    const pago = {
      formaPago: 5,
      referencia: "Mastercard - ****1234",
      observaciones: "Marca: Mastercard | Vencimiento: 05/28",
    };
    const datos = datosTarjetaDesdePago(pago);
    expect(datos.marcaTarjeta).toBe("Mastercard");
    expect(datos.numeroTarjeta).toBe("1234");
    expect(datos.vencimientoTarjeta).toBe("05/28");
  });

  it("usa la marca de la referencia cuando no hay observaciones", () => {
    const pago = {
      referencia: "Visa - Ana - ****1111",
    };
    const datos = datosTarjetaDesdePago(pago);
    expect(datos.marcaTarjeta).toBe("Visa");
    expect(datos.titularTarjeta).toBe("Ana");
    expect(datos.numeroTarjeta).toBe("1111");
  });

  it("vuelve valores vacíos/por defecto cuando no hay datos", () => {
    expect(datosTarjetaDesdePago({})).toEqual({
      marcaTarjeta: "Visa",
      titularTarjeta: "",
      vencimientoTarjeta: "",
      numeroTarjeta: "",
    });
  });
});
