/* pagosExportarCsv - Exportacion de listado a CSV */

import { formaPagoTexto, estadoPagoTexto } from "../pagos";
import { getPlanNombre } from "../planes";
import { descargarCsv } from "./csvComun";
import { fechaTexto } from "../fechas";

export const exportarPagosCsv = (pagos = [], membresias = []) => {
  if (!pagos.length) return;

  const encabezados = [
    "ID",
    "Socio",
    "Membresía",
    "Monto",
    "Forma de pago",
    "Fecha",
    "Estado",
    "Referencia",
    "Observaciones",
  ];

  const filas = pagos.map((pago) => [
    pago.id,
    `${pago.socioNombre || ""} ${pago.socioApellido || ""}`.trim(),
    getPlanNombre(pago, membresias),
    pago.monto,
    formaPagoTexto(pago.formaPago),
    fechaTexto(pago.fechaPago),
    estadoPagoTexto(pago.estado),
    pago.referencia || "",
    pago.observaciones || "",
  ]);

  descargarCsv("pagos", encabezados, filas);
};
