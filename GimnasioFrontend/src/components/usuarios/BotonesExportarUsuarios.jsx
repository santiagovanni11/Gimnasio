/* BotonesExportarUsuarios - CSV y PDF del listado de usuarios */

import { exportarUsuariosCsv } from "../../utils/exportar/usuariosExportarCsv";
import { exportarUsuariosPdf } from "../../utils/exportar/usuariosExportarPdf";

export default function BotonesExportarUsuarios({ usuarios = [] }) {
  return (
    <>
      <button
        type="button"
        className="export-button"
        onClick={() => exportarUsuariosCsv(usuarios)}
        disabled={!usuarios.length}
        title="Exportar usuarios a CSV"
      >
        Exportar CSV
      </button>

      <button
        type="button"
        className="export-button"
        onClick={() => exportarUsuariosPdf(usuarios)}
        disabled={!usuarios.length}
        title="Exportar usuarios a PDF"
      >
        Exportar PDF
      </button>
    </>
  );
}
