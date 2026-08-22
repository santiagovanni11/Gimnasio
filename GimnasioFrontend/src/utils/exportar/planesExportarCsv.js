/* planesExportarCsv - Export de la tabla de configuracion de precios */

const fecha = () => new Date().toISOString().slice(0, 10);

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

  const csv = [encabezados, ...filas]
    .map((fila) =>
      fila
        .map((celda) => `"${String(celda ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `precios_${fecha()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
