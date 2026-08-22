// =========================================================
// UTILIDADES DE CIERRE DE CAJA
// Cálculo y exportación del cierre diario por forma de pago.
// =========================================================

import jsPDF from "jspdf";
import {
  FORMA_PAGO,
  formaPagoTexto,
  esAprobado,
  soloValidos,
} from "./pagos";

/**
 * Calcula el cierre de caja para una fecha (ISO yyyy-mm-dd).
 * Solo pagos aprobados y vigentes (no anulados).
 */
export const calcularCierreCaja = (pagos = [], fechaISO) => {
  const delDia = soloValidos(pagos).filter(
    (pago) =>
      esAprobado(pago) &&
      (pago.fechaPago || "").slice(0, 10) === fechaISO
  );

  const formas = Object.values(FORMA_PAGO)
    .map((forma) => {
      const items = delDia.filter(
        (pago) => Number(pago.formaPago) === forma
      );

      return {
        forma,
        nombre: formaPagoTexto(forma),
        cantidad: items.length,
        monto: items.reduce(
          (total, pago) => total + Number(pago.monto || 0),
          0
        ),
      };
    })
    .filter((item) => item.cantidad > 0);

  return {
    fecha: fechaISO,
    formas,
    cantidad: delDia.length,
    total: delDia.reduce(
      (total, pago) => total + Number(pago.monto || 0),
      0
    ),
  };
};

/**
 * Exporta el cierre de caja como PDF.
 */
export const exportarCierrePdf = (cierre, responsable) => {
  if (!cierre || !cierre.cantidad) return;

  const doc = new jsPDF();
  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("CIERRE DE CAJA DIARIO", 14, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Fecha: ${cierre.fecha}`, 14, y);

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
    doc.text(formatoMoneda.format(item.monto), 196, y, {
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
  doc.text("TOTAL", 14, y);
  doc.text(formatoMoneda.format(cierre.total), 196, y, {
    align: "right",
  });

  doc.save(`cierre_caja_${cierre.fecha}.pdf`);
};
