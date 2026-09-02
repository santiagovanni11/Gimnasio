/* BotonesExportarPrecios - CSV y PDF de la tabla de precios */

import { exportarPlanesCsv } from "../../utils/exportar/planesExportarCsv";
import { exportarPlanesPdf } from "../../utils/exportar/planesExportarPdf";

export default function BotonesExportarPrecios({ planes = [] }) {
  return (
    <>
      <button
        type="button"
        className="export-button"
        onClick={() => exportarPlanesCsv(planes)}
        disabled={!planes.length}
        title="Exportar tabla de precios a CSV"
      >
        Exportar CSV
      </button>

      <button
        type="button"
        className="export-button"
        onClick={() => exportarPlanesPdf(planes)}
        disabled={!planes.length}
        title="Exportar tabla de precios a PDF"
      >
        Exportar PDF
      </button>
    </>
  );
}
