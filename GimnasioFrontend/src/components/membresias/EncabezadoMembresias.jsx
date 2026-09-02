// =========================================================
// ENCABEZADO DE MEMBRESÍAS
// Título + acciones globales: exportar CSV y nueva membresía.
// =========================================================

import { exportarMembresiasCsv } from "../../utils/membresias";
import { exportarMembresiasPdf } from "../../utils/exportar/membresiasExportarPdf";

function EncabezadoMembresias({
  puedeCrear,
  membresiasVisibles,
  alAbrirNueva,
}) {
  const abrirNueva = () => {
    alAbrirNueva();
  };

  return (
    <div className="section-header">
      <div>
        <h2>Membresías</h2>
        <p>Membresías registradas en el gimnasio.</p>
      </div>

      {puedeCrear && (
        <div className="section-actions">
          <button
            type="button"
            className="export-button"
            onClick={() => exportarMembresiasCsv(membresiasVisibles)}
            disabled={!membresiasVisibles.length}
            title="Exportar listado a CSV"
          >
            Exportar CSV
          </button>

          <button
            type="button"
            className="export-button"
            onClick={() => exportarMembresiasPdf(membresiasVisibles)}
            disabled={!membresiasVisibles.length}
            title="Exportar listado a PDF"
          >
            Exportar PDF
          </button>

          <button
            type="button"
            className="primary-small-button"
            onClick={abrirNueva}
          >
            + Nueva membresía
          </button>
        </div>
      )}
    </div>
  );
}

export default EncabezadoMembresias;
