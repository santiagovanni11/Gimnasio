/* pagosExportarCsv - Exportacion de listado a CSV */

import { formaPagoTexto, estadoPagoTexto } from "../pagos";
import { getPlanNombre } from "../planes";

const fechaTexto = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "";

export const exportarPagosCsv = (
  pagos = [],
  membresias = []
) => {
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

  const csv = [encabezados, ...filas]
    .map((fila) =>
      fila
        .map((celda) => `"${String(celda).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `pagos_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

