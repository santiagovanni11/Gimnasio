/* pagosExportarPdf - Reporte PDF del resumen de pagos */

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  formaPagoTexto,
  estadoPagoTexto,
  formatoMoneda,
  ESTADO_PAGO,
} from "../pagos";
import { fechaTexto } from "../fechas";
import { encabezadoForza, pieForza } from "./pdfBranding";

/** Solo aprobados y rechazados: excluye pendientes, cancelados y anulados. */
const pagosParaPdf = (pagos) =>
  pagos.filter(
    (pago) =>
      Number(pago.estado) === ESTADO_PAGO.APROBADO ||
      Number(pago.estado) === ESTADO_PAGO.RECHAZADO
  );

const agregarFiltrosAlPdf = (doc, filtros, yInicial) => {
  let y = yInicial;

  if (filtros.fechaDesde || filtros.fechaHasta) {
    const desde = filtros.fechaDesde
      ? new Date(`${filtros.fechaDesde}T00:00:00`).toLocaleDateString("es-AR")
      : "—";
    const hasta = filtros.fechaHasta
      ? new Date(`${filtros.fechaHasta}T00:00:00`).toLocaleDateString("es-AR")
      : "—";

    doc.text(`Período: ${desde} - ${hasta}`, 14, y);
    y += 7;
  }

  if (filtros.filtroPlan) {
    const planTexto =
      filtros.filtroPlan === "premium"
        ? "Premium"
        : filtros.filtroPlan === "basico"
        ? "Básico"
        : filtros.filtroPlan;

    doc.text(`Membresía: ${planTexto}`, 14, y);
    y += 7;
  }

  if (filtros.filtroFormaPago) {
    doc.text(
      `Forma de pago: ${formaPagoTexto(filtros.filtroFormaPago)}`,
      14,
      y
    );
    y += 7;
  }

  return y;
};

export const exportarPagosPdf = (
  pagosFiltrados = [],
  { fechaDesde = "", fechaHasta = "", filtroPlan = "", filtroFormaPago = "" } = {}
) => {
  const pagos = pagosParaPdf(pagosFiltrados);
  if (!pagos.length) return;

  const doc = new jsPDF();
  const ahora = new Date();

  const aprobados = pagos.filter(
    (p) => Number(p.estado) === ESTADO_PAGO.APROBADO
  );
  const rechazados = pagos.filter(
    (p) => Number(p.estado) === ESTADO_PAGO.RECHAZADO
  );
  const totalCobrado = aprobados.reduce(
    (total, pago) => total + Number(pago.monto || 0),
    0
  );

  const y0 = encabezadoForza(doc, {
    titulo: "Resumen de pagos",
    subtitulo: `Generado: ${ahora.toLocaleDateString("es-AR")} ${ahora.toLocaleTimeString(
      "es-AR",
      { hour: "2-digit", minute: "2-digit" }
    )}`,
  });

  let y = agregarFiltrosAlPdf(doc, { fechaDesde, fechaHasta, filtroPlan, filtroFormaPago }, y0);

  y += 4;
  doc.setFontSize(11);
  doc.text(`Total de pagos: ${pagos.length}`, 14, y);
  doc.text(`Aprobados: ${aprobados.length}`, 14, y + 7);
  doc.text(`Rechazados: ${rechazados.length}`, 14, y + 14);

  y += 23;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL COBRADO: ${formatoMoneda(totalCobrado)}`, 14, y);

  doc.setFont("helvetica", "normal");
  y += 10;

  const filas = pagos.map((pago) => [
    fechaTexto(pago.fechaPago),
    `${pago.socioNombre || ""} ${pago.socioApellido || ""}`.trim(),
    formatoMoneda(Number(pago.monto || 0)),
    formaPagoTexto(pago.formaPago),
    estadoPagoTexto(pago.estado),
    pago.referencia || "",
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Fecha", "Socio", "Monto", "Forma", "Estado", "Referencia"]],
    body: filas,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  const paginas = doc.internal.getNumberOfPages();
  for (let pagina = 1; pagina <= paginas; pagina++) {
    doc.setPage(pagina);
    pieForza(doc, pagina, paginas, "Resumen de pagos");
  }

  doc.save(`resumen_pagos_${new Date().toISOString().slice(0, 10)}.pdf`);
};
