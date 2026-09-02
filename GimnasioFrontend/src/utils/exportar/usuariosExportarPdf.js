/* usuariosExportarPdf - Reporte PDF del listado de usuarios */

import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

export const exportarUsuariosPdf = (usuarios = []) => {
  if (!usuarios.length) return;

  const doc = new jsPDF();
  const ahora = new Date();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LISTADO DE USUARIOS", 14, 18);

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

  const activos = usuarios.filter((u) => u.activo !== false).length;

  let y = 42;
  doc.setFontSize(11);
  doc.text(`Total: ${usuarios.length}`, 14, y);
  doc.text(`Activos: ${activos}`, 14, y + 7);
  doc.text(`Inactivos: ${usuarios.length - activos}`, 14, y + 14);

  y += 24;

  const filas = usuarios.map((u) => [
    u.email,
    `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim(),
    u.rolNombre ?? "",
    u.activo === false ? "Inactivo" : "Activo",
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Email", "Nombre", "Rol", "Estado"]],
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

  doc.save(`usuarios_${new Date().toISOString().slice(0, 10)}.pdf`);
};
