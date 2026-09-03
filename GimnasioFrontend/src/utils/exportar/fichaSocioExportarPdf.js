// =========================================================
// EXPORTACIÓN DE FICHA DEL SOCIO A PDF
// Ensambla las secciones definidas en fichaSocioPdfPiezas:
// datos personales, membresía actual, historial de
// membresías y pagos.
// =========================================================

import jsPDF from "jspdf";
import {
  nombreCompleto,
  encabezadoFicha,
  seccionDatosPersonales,
  seccionMembresiaActual,
  seccionHistorialMembresias,
  seccionPagos,
} from "./fichaSocioPdfPiezas";
import { pieForza } from "./pdfBranding";

/** Dibuja la ficha completa sobre el documento. */
const armarFicha = (doc, datos) => {
  const { socio, visual, pagado, faltantes, historial, pagosDelSocio } =
    datos;

  let y = encabezadoFicha(doc, socio, faltantes);

  y = seccionDatosPersonales(doc, socio, y);
  y = seccionMembresiaActual(doc, visual, pagado, y);
  y = seccionHistorialMembresias(doc, historial, y);
  seccionPagos(doc, pagosDelSocio, y);
};

/** Nombre de archivo saneado: ficha_apellido_nombre_dni.pdf */
const nombreArchivo = (socio) => {
  const base =
    nombreCompleto(socio).toLowerCase().replace(/\s+/g, "_") || "socio";

  return `ficha_${base}${socio?.dni ? `_${socio.dni}` : ""}.pdf`;
};

/** Genera y descarga la ficha del socio como PDF. */
export const descargarFichaSocioPdf = (datos) => {
  const doc = new jsPDF();

  armarFicha(doc, datos);

  const paginas = doc.internal.getNumberOfPages();
  for (let pagina = 1; pagina <= paginas; pagina++) {
    doc.setPage(pagina);
    pieForza(doc, pagina, paginas, "Ficha del socio");
  }

  doc.save(nombreArchivo(datos.socio));
};
