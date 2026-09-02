// =========================================================
// EXPORTACIÓN CSV COMÚN
// Serialización y descarga compartidas por todos los
// exportadores de listados (socios, membresías, pagos, planes).
// =========================================================

/** Convierte encabezados + filas (arrays de celdas) en texto CSV. */
const aCsv = (encabezados, filas) =>
  [encabezados, ...filas]
    .map((fila) =>
      fila
        .map((celda) => `"${String(celda ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

/** Genera y descarga `prefijo_aaaa-mm-dd.csv` con BOM UTF-8. */
export const descargarCsv = (prefijo, encabezados, filas) => {
  const blob = new Blob(["\uFEFF" + aCsv(encabezados, filas)], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${prefijo}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
