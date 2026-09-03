// =========================================================
// UTILIDADES DE TICKET
// Generación del comprobante de pago en PDF (formato ticket).
// =========================================================

import jsPDF from "jspdf";
import { formatoMoneda } from "./pagos";
import {
  MARCA,
  COLOR_PRINCIPAL,
  COLOR_GRIS,
  COLOR_LINEA,
} from "./exportar/pdfBranding";

const ANCHO = 80;
const MARGEN = 8;
const CENTRO = ANCHO / 2;
const COLOR_OSCURO_TICKET = [18, 26, 22];

const linea = (doc, y) => {
  doc.setDrawColor(200);
  doc.line(MARGEN, y, ANCHO - MARGEN, y);
};

const fila = (doc, etiqueta, valor, y) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(etiqueta, MARGEN, y);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  const anchoTexto = doc.getTextWidth(valor);
  doc.text(valor, ANCHO - MARGEN - anchoTexto, y);
};

/**
 * Descarga el comprobante de pago como PDF.
 * @param {object} ticket - Datos del ticket (construido por construirTicketPago)
 */
export const descargarTicketPdf = (ticket) => {
  if (!ticket) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [ANCHO, 150],
  });

  let y = 16;

  // Encabezado FORZA
  doc.setFillColor(...COLOR_OSCURO_TICKET);
  doc.rect(0, 0, ANCHO, 24, "F");
  doc.setFillColor(...COLOR_PRINCIPAL);
  doc.rect(0, 24, ANCHO, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLOR_PRINCIPAL);
  doc.text(MARCA, CENTRO, 13, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(215, 225, 218);
  doc.text("Comprobante de pago", CENTRO, y, { align: "center" });
  y += 7;
  doc.setDrawColor(...COLOR_LINEA);
  doc.line(MARGEN, y, ANCHO - MARGEN, y);

  // Datos
  y += 6;
  fila(doc, "Cliente", ticket.clienteNombre || "-", y);

  y += 5;
  fila(doc, "DNI", ticket.clienteDni || "-", y);

  y += 5;
  fila(doc, "Plan", ticket.planNombre || "-", y);

  y += 5;
  fila(doc, "Fecha", ticket.fecha || "-", y);

  y += 3;
  linea(doc, y);

  // Total
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", MARGEN, y);
  doc.text(ticket.monto || "-", ANCHO - MARGEN, y, { align: "right" });

  // Pie
  y += 10;
  doc.setDrawColor(...COLOR_LINEA);
  doc.line(MARGEN, y, ANCHO - MARGEN, y);
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRINCIPAL);
  doc.text("\u00a1Gracias por su pago!", CENTRO, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLOR_GRIS);
  doc.text(MARCA, CENTRO, y, { align: "center" });

  const nombre = `ticket_${(ticket.clienteNombre || "pago")
    .toLowerCase()
    .replace(/\s+/g, "_")}.pdf`;

  doc.save(nombre);
};

/**
 * Construye los datos del ticket a partir del pago registrado,
 * resolviendo el cliente vía membresía -> socio.
 */
export const construirTicketPago = (
  pagoPersistido,
  membresias = [],
  socios = []
) => {
  const membresia = membresias.find(
    (m) => Number(m.id) === Number(pagoPersistido?.membresiaId)
  );
  const socio = socios.find(
    (s) => Number(s.id) === Number(membresia?.socioId)
  );

  const nombreCompleto =
    socio?.nombre && socio?.apellido
      ? `${socio.nombre} ${socio.apellido}`
      : membresia?.socioNombre && membresia?.socioApellido
      ? `${membresia.socioNombre} ${membresia.socioApellido}`
      : "Cliente";

  return {
    clienteNombre: nombreCompleto,
    clienteDni: socio?.dni || "-",
    clienteTelefono: socio?.telefono || "-",
    clienteEmail: socio?.email || "-",
    membresiaNombre: `Membresía ${membresia?.id || pagoPersistido?.membresiaId || "-"}`,
    planNombre: membresia?.planNombre || "Plan",
    fecha: pagoPersistido?.fechaPago
      ? new Date(pagoPersistido.fechaPago).toLocaleDateString("es-AR")
      : new Date().toLocaleDateString("es-AR"),
    monto: formatoMoneda(pagoPersistido?.monto || 0),
  };
};
