// =========================================================
// HELPERS DE DIBUJO DE TABLAS PDF
// Bloques clave-valor y listados con encabezado sobre jsPDF.
// =========================================================

import { autoTable } from "jspdf-autotable";

/** Bloque clave-valor con estilo plano. Devuelve la Y final. */
export const tablaClaveValor = (doc, filas, y) => {
  autoTable(doc, {
    startY: y,
    body: filas,
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45 },
      1: { cellWidth: "auto" },
    },
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY;
};

/** Tabla de listado con encabezado. Devuelve la Y final. */
export const tablaListado = (doc, head, body, y) => {
  autoTable(doc, {
    startY: y,
    head: [head],
    body,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY;
};

/** Título de sección en negrita. Devuelve la Y para el cuerpo. */
export const tituloSeccion = (doc, texto, y) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(texto, 14, y);
  return y + 4;
};
