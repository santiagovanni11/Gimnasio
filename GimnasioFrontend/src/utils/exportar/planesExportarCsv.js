/* planesExportarCsv - Export de la tabla de configuracion de precios */

import { descargarCsv } from "./csvComun";

export const exportarPlanesCsv = (planes = []) => {
  if (!planes.length) return;

  const encabezados = [
    "Plan",
    "Activo",
    "1 mes",
    "3 meses",
    "6 meses",
    "12 meses",
  ];

  const filas = planes.map((p) => [
    p.nombre,
    p.activo === false ? "Inactivo" : "Activo",
    p.precio1Mes,
    p.precio3Meses,
    p.precio6Meses,
    p.precio12Meses,
  ]);

  descargarCsv("precios", encabezados, filas);
};
