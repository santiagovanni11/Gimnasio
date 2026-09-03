// =========================================================
// PIEZAS DEL PDF DE FICHA DEL SOCIO
// Secciones consumidas por el ensamblador
// fichaSocioExportarPdf. El dibujo de tablas vive en
// fichaSocioPdfTablas.
// =========================================================

import {
  formaPagoTexto,
  estadoPagoTexto,
  formatoMoneda,
} from "../pagos";
import { fechaTexto } from "../fechas";
import {
  tablaClaveValor,
  tablaListado,
  tituloSeccion,
} from "./fichaSocioPdfTablas";
import { encabezadoForza } from "./pdfBranding";

export const nombreCompleto = (socio) =>
  `${socio?.nombre ?? ""} ${socio?.apellido ?? ""}`.trim();

/** Encabezado del documento con nombre y aviso de incompletos. */
export const encabezadoFicha = (doc, socio, faltantes) => {
  let y = encabezadoForza(doc, {
    titulo: nombreCompleto(socio) || "Socio",
    subtitulo: `Ficha del socio · Generada: ${new Date().toLocaleDateString(
      "es-AR"
    )}`,
  });

  if (faltantes.length > 0) {
    doc.setTextColor(180, 120, 0);
    doc.text(`Datos incompletos: ${faltantes.join(", ")}`, 14, y);
    y += 5;
    doc.setTextColor(0);
  }

  return y;
};

/** Sección datos personales. */
export const seccionDatosPersonales = (doc, socio, y) => {
  const fin = tituloSeccion(doc, "Datos personales", y + 7);

  return tablaClaveValor(
    doc,
    [
      ["DNI", socio.dni || "-"],
      ["Teléfono", socio.telefono || "-"],
      ["Email", socio.email || "-"],
      ["Dirección", socio.direccion || "-"],
      ["Nacimiento", fechaTexto(socio.fechaNacimiento) || "-"],
      ["Alta", fechaTexto(socio.fechaAlta) || "-"],
    ],
    fin
  );
};

/** Sección membresía vigente (o su estado si no tiene). */
export const seccionMembresiaActual = (doc, visual, pagado, y) => {
  const membresia = visual?.membresia;
  const fin = tituloSeccion(doc, "Membresía actual", y + 6);

  if (!membresia) {
    return tablaClaveValor(
      doc,
      [["Estado", visual?.texto || "Sin membresía"]],
      fin
    );
  }

  const saldo = Number(membresia.precioAplicado || 0) - pagado;

  return tablaClaveValor(
    doc,
    [
      ["Plan", membresia.planNombre || "-"],
      ["Estado", visual.texto],
      ["Vence", fechaTexto(visual.fechaFin) || "-"],
      [
        "Pagado / Total",
        `${formatoMoneda(pagado)} / ${formatoMoneda(membresia.precioAplicado)}`,
      ],
      ["Saldo pendiente", saldo > 0 ? formatoMoneda(saldo) : "Sin deuda"],
    ],
    fin
  );
};

/** Sección historial de membresías. */
export const seccionHistorialMembresias = (doc, historial, y) => {
  const fin = tituloSeccion(
    doc,
    `Historial de membresías (${historial.length})`,
    y + 6
  );

  if (!historial.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Sin registros.", 14, fin);
    return fin + 6;
  }

  return tablaListado(
    doc,
    ["Plan", "Estado", "Inicio", "Vence", "Precio"],
    historial.map((m) => [
      m.planNombre || `Plan #${m.planId}`,
      m.estadoTexto,
      fechaTexto(m.fechaInicio) || "-",
      fechaTexto(m.fechaFin) || "-",
      formatoMoneda(m.precioAplicado),
    ]),
    fin
  );
};

/** Sección pagos del socio. */
export const seccionPagos = (doc, pagosDelSocio, y) => {
  const fin = tituloSeccion(doc, `Pagos (${pagosDelSocio.length})`, y + 6);

  if (!pagosDelSocio.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Sin pagos registrados.", 14, fin);
    return;
  }

  tablaListado(
    doc,
    ["Fecha", "Monto", "Forma", "Estado", "Referencia"],
    pagosDelSocio.map((pago) => [
      fechaTexto(pago.fechaPago) || "-",
      formatoMoneda(pago.monto),
      formaPagoTexto(pago.formaPago),
      estadoPagoTexto(pago.estado),
      pago.referencia || "-",
    ]),
    fin
  );
};
