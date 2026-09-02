/* membresiasExportarPdf - Reporte PDF del listado de membresías */

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { estadoMembresiaTexto } from "../membresias";
import { formatoMoneda, estadoPagoTexto, formaPagoTexto } from "../pagos";
import { fechaTexto } from "../fechas";

export const exportarMembresiaPdf = (membresia, pagos = [], resumen = null) => {
  if (!membresia) return;

  const doc = new jsPDF();
  const socio = `${membresia.socioNombre || ""} ${membresia.socioApellido || ""}`.trim();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLE DE MEMBRESÍA", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Socio: ${socio || "Sin dato"}`, 14, 28);
  doc.text(`Plan: ${membresia.planNombre || "-"}`, 14, 34);
  doc.text(`Período: ${fechaTexto(membresia.fechaInicio) || "-"} al ${fechaTexto(membresia.fechaFin) || "-"}`, 14, 40);

  const pagadoPeriodo = (pagos || [])
    .filter((pago) => Number(pago.estado) === 2)
    .reduce((sum, pago) => sum + Number(pago.monto || 0), 0);

  const filas = [
    ["Precio aplicado", formatoMoneda(Number(membresia.precioAplicado || 0))],
    ["Estado", estadoMembresiaTexto(membresia.estado)],
    ["Cobrado del período", formatoMoneda(pagadoPeriodo)],
    ["Membresías registradas", String(resumen?.registradas ?? "-")],
    ["Aporte histórico", formatoMoneda(Number(resumen?.totalHistorico || pagadoPeriodo))],
  ];

  autoTable(doc, {
    startY: 48,
    body: filas.map(([campo, valor]) => ({ campo, valor })),
    columns: [{ header: "Campo", dataKey: "campo" }, { header: "Valor", dataKey: "valor" }],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 80, fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  if (Array.isArray(pagos) && pagos.length) {
    const filasPagos = pagos.map((pago) => [
      fechaTexto(pago.fechaPago) || "-",
      estadoPagoTexto(pago.estado),
      formaPagoTexto(pago.formaPago),
      formatoMoneda(Number(pago.monto || 0)),
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Fecha", "Estado", "Forma", "Monto"]],
      body: filasPagos,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [26, 77, 117], textColor: 255, fontStyle: "bold" },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save(`membresia_${socio || "detalle"}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportarMembresiasPdf = (membresias = []) => {
  if (!membresias.length) return;

  const doc = new jsPDF();
  const ahora = new Date();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LISTADO DE MEMBRESÍAS", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema de gestión del gimnasio", 14, 25);
  doc.text(
    `Generado: ${ahora.toLocaleDateString("es-AR")} ${ahora.toLocaleTimeString(
      "es-AR",
      { hour: "2-digit", minute: "2-digit" }
    )}`,
    14,
    31
  );

  const totales = {
    activas: membresias.filter((m) => Number(m.estado) === 1).length,
    vencidas: membresias.filter((m) => Number(m.estado) === 3).length,
    suspendidas: membresias.filter((m) => Number(m.estado) === 4).length,
    canceladas: membresias.filter((m) => Number(m.estado) === 5).length,
  };

  let y = 42;
  doc.setFontSize(11);
  doc.text(`Total: ${membresias.length}`, 14, y);
  doc.text(`Activas: ${totales.activas}`, 14, y + 7);
  doc.text(`Vencidas: ${totales.vencidas}`, 14, y + 14);
  doc.text(`Suspendidas: ${totales.suspendidas}`, 14, y + 21);
  doc.text(`Canceladas: ${totales.canceladas}`, 14, y + 28);

  y += 38;

  const filas = membresias.map((m) => [
    `${m.socioNombre || ""} ${m.socioApellido || ""}`.trim(),
    m.planNombre || "",
    formatoMoneda(Number(m.precioAplicado || 0)),
    m.fechaInicio ? fechaTexto(m.fechaInicio) : "",
    m.fechaFin ? fechaTexto(m.fechaFin) : "",
    estadoMembresiaTexto(m.estado),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Socio", "Plan", "Precio", "Inicio", "Vencimiento", "Estado"]],
    body: filas,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  const paginas = doc.internal.getNumberOfPages();
  for (let pagina = 1; pagina <= paginas; pagina++) {
    doc.setPage(pagina);
    const alto = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text(`Página ${pagina} de ${paginas}`, 14, alto - 10);
    doc.text(
      "Listado generado desde el sistema de gestión del gimnasio.",
      196,
      alto - 10,
      { align: "right" }
    );
  }

  doc.save(`membresias_${new Date().toISOString().slice(0, 10)}.pdf`);
};
