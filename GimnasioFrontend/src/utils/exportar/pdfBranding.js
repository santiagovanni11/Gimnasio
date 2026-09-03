// =========================================================
// pdfBranding.js — Identidad visual FORZA para todos los PDF.
// Paleta, encabezado y pie profesional y consistente sobre
// jsPDF. Reutilizado por ticket, comprobantes y reportes.
// =========================================================

export const MARCA = "FORZA";
export const COLOR_PRINCIPAL = [47, 191, 113];
export const COLOR_OSCURO = [18, 26, 22];
export const COLOR_GRIS = [120, 130, 122];
export const COLOR_LINEA = [200, 210, 204];

/** Encabezado de marca: barra verde con FORZA + titulo + subtitulo.
 *  Devuelve la Y en la que puede empezar el contenido. */
export const encabezadoForza = (
  doc,
  { titulo = "", subtitulo = "" } = {}
) => {
  const ancho = doc.internal.pageSize.width;
  const altoBarra = 26;

  doc.setFillColor(...COLOR_OSCURO);
  doc.rect(0, 0, ancho, altoBarra, "F");

  doc.setFillColor(...COLOR_PRINCIPAL);
  doc.rect(0, altoBarra - 3, ancho, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...COLOR_PRINCIPAL);
  doc.text(MARCA, 14, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(215, 225, 218);
  doc.text("CENTRO DEPORTIVO", ancho - 14, 14, {
    align: "right",
  });
  doc.text("Gestión de miembros y cobros", ancho - 14, 20, {
    align: "right",
  });

  let y = altoBarra + 10;
  if (titulo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...COLOR_OSCURO);
    doc.text(titulo, 14, y);
    y += 7;
  }

  if (subtitulo) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_GRIS);
    doc.text(subtitulo, 14, y);
    y += 5;
  }

  doc.setDrawColor(...COLOR_LINEA);
  doc.line(14, y, ancho - 14, y);

  return y + 8;
};

/** Pie de página con marca y numeracion (para A4). */
export const pieForza = (doc, hojaActual, hojasTotales, texto = "") => {
  const ancho = doc.internal.pageSize.width;
  const alto = doc.internal.pageSize.height;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_GRIS);
  doc.text(
    `${MARCA} · ${texto || "Documento generado por el sistema"}`,
    14,
    alto - 8
  );
  doc.text(`Página ${hojaActual} de ${hojasTotales}`, ancho - 14, alto - 8, {
    align: "right",
  });
};
