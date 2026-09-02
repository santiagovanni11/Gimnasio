/* planesExportarPdf - Reporte PDF de la configuración de precios */

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { formatoMoneda } from "../pagos";

export const exportarPlanesPdf = (planes = []) => {
  if (!planes.length) return;

  const doc = new jsPDF();
  const ahora = new Date();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CONFIGURACIÓN DE PRECIOS", 14, 18);

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

  const activos = planes.filter((p) => p.activo !== false).length;

  let y = 42;
  doc.setFontSize(11);
  doc.text(`Total de planes: ${planes.length}`, 14, y);
  doc.text(`Activos: ${activos}`, 14, y + 7);
  doc.text(`Pausados: ${planes.length - activos}`, 14, y + 14);

  y += 26;

  const filas = planes.map((p) => [
    p.nombre,
    p.activo === false ? "Pausado" : "Activo",
    formatoMoneda(Number(p.precio1Mes || 0)),
    formatoMoneda(Number(p.precio3Meses || 0)),
    formatoMoneda(Number(p.precio6Meses || 0)),
    formatoMoneda(Number(p.precio12Meses || 0)),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Plan", "Estado", "1 mes", "3 meses", "6 meses", "12 meses"]],
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

  doc.save(`precios_${new Date().toISOString().slice(0, 10)}.pdf`);
};
