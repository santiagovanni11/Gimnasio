// =========================================================
// UTILIDADES DE TICKET
// Generación del comprobante de pago en PDF (formato ticket).
// =========================================================

import jsPDF from "jspdf";

const ANCHO = 80;
const MARGEN = 8;
const CENTRO = ANCHO / 2;

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

  let y = 14;

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("GYM", CENTRO, y, { align: "center" });

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text("Comprobante de pago", CENTRO, y, { align: "center" });

  y += 4;
  linea(doc, y);

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
  doc.text(ticket.monto || "-", ANCHO - MARGEN, y, {
    align: "right",
  });

  // Pie
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(130);
  doc.text("¡Gracias por su pago!", CENTRO, y, { align: "center" });

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
    monto: new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(Number(pagoPersistido?.monto || 0)),
  };
};
