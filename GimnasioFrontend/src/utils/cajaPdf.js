// =========================================================
// CIERRE DE CAJA — EXPORTACIÓN PDF
// Un solo generador para cierre diario y por rango: el propio
// cierre describe su período (fecha única o desde/hasta).
// =========================================================

import jsPDF from "jspdf";
import { formatoMoneda } from "./pagos";

/** Título del documento según el tipo de cierre. */
const titulo = (cierre) =>
  cierre.fecha
    ? "CIERRE DE CAJA DIARIO"
    : "CIERRE DE CAJA - PERIODO";

/** Descripción del período en el encabezado. */
const periodoTexto = (cierre) =>
  cierre.fecha
    ? `Fecha: ${cierre.fecha}`
    : `Período: ${cierre.desde} al ${cierre.hasta}`;

/** Nombre del archivo descargable. */
const nombreArchivo = (cierre) =>
  cierre.fecha
    ? `cierre_caja_${cierre.fecha}.pdf`
    : `cierre_caja_${cierre.desde}_al_${cierre.hasta}.pdf`;

/**
 * Exporta el cierre de caja como PDF.
 */
export const exportarCierrePdf = (cierre, responsable) => {
  if (!cierre || !cierre.cantidad) return;

  const doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(titulo(cierre), 14, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(periodoTexto(cierre), 14, y);

  y += 6;
  doc.text(`Responsable: ${responsable || "-"}`, 14, y);

  y += 6;
  doc.text(
    `Generado: ${new Date().toLocaleString("es-AR")}`,
    14,
    y
  );

  y += 10;

  cierre.formas.forEach((item) => {
    doc.text(item.nombre, 14, y);
    doc.text(`${item.cantidad} pago(s)`, 80, y);
    doc.text(formatoMoneda(item.monto), 196, y, {
      align: "right",
    });
    y += 7;
  });

  y += 4;
  doc.setDrawColor(150);
  doc.line(14, y, 196, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    cierre.fecha ? "TOTAL" : "TOTAL DEL PERÍODO",
    14,
    y
  );
  doc.text(formatoMoneda(cierre.total), 196, y, {
    align: "right",
  });

  doc.save(nombreArchivo(cierre));
};
