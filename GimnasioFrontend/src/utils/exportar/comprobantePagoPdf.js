// =========================================================
// COMPROBANTE DE PAGO EN PDF
// Recibo individual descargable desde el detalle del pago.
// =========================================================

import jsPDF from "jspdf";
import {
  formatoMoneda,
  formaPagoTexto,
  estadoPagoTexto,
} from "../pagos";
import { fechaDesdeUtc } from "../fechas";
import { encabezadoForza, pieForza } from "./pdfBranding";

/** Fecha local larga (ej: "25 de agosto de 2026"). */
const fechaLarga = (valor) =>
  fechaDesdeUtc(valor)?.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }) ?? "-";

/** Número de comprobante con ceros (PAGO-000123). */
const numeroComprobante = (id) =>
  `PAGO-${String(id).padStart(6, "0")}`;

/**
 * Genera y descarga el comprobante del pago indicado.
 * planNombre es opcional y lo resuelve el llamador.
 */
export const exportarComprobantePagoPdf = (
  pago,
  planNombre
) => {
  if (!pago) return;

  const doc = new jsPDF();

  let y = encabezadoForza(doc, {
    titulo: "Comprobante de pago",
    subtitulo: numeroComprobante(pago.id),
  });

  const filas = [
    ["Socio", socioTexto(pago)],
    ["Membresía / plan", planNombre || "-"],
    ["Fecha", fechaLarga(pago.fechaPago)],
    ["Forma de pago", formaPagoTexto(pago.formaPago)],
    ["Estado", estadoPagoTexto(pago.estado)],
    ["Referencia", pago.referencia || "-"],
    ["Registrado por", pago.registradoPor || "-"],
  ];

  filas.forEach(([etiqueta, valor]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(etiqueta, 14, y);

    doc.setTextColor(0);
    doc.text(String(valor), 70, y);
    y += 7;
  });

  y += 4;
  doc.setDrawColor(150);
  doc.line(14, y, 196, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TOTAL", 14, y);
  doc.text(formatoMoneda(pago.monto), 196, y, {
    align: "right",
  });

  pieForza(doc, 1, 1, "Comprobante de pago");

  doc.save(`comprobante_pago_${pago.id}.pdf`);
};

function socioTexto(pago) {
  const texto = `${pago.socioNombre || ""} ${
    pago.socioApellido || ""
  }`.trim();

  return texto || "-";
}
