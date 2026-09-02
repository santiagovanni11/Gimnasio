// IMPORTACIÓN DE SOCIOS — modal controlado. El disparador
// (botón "Importar CSV") vive en SociosAcciones; aquí solo
// se muestra el diálogo y se procesa el archivo.

import { useState } from "react";
import { sociosService } from "../../services/sociosService";

const separarLinea = (linea) => {
  const celdas = [];
  let actual = "", enComillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (c === '"') {
      if (enComillas && linea[i + 1] === '"') { actual += '"'; i++; }
      else enComillas = !enComillas;
    } else if (c === "," && !enComillas) {
      celdas.push(actual);
      actual = "";
    } else actual += c;
  }
  celdas.push(actual);
  return celdas;
};

const parsearCsv = (texto) => {
  const lineas = texto.trim().split(/\r?\n/).filter(Boolean);
  if (lineas.length < 2) return [];
  const encabezados = separarLinea(lineas[0])
    .map((h) => h.trim().toLowerCase());
  return lineas.slice(1).map((linea) => {
    const celdas = separarLinea(linea);
    const fila = {};
    encabezados.forEach((h, i) => (fila[h] = (celdas[i] ?? "").trim()));
    return fila;
  });
};

const aSocio = (f) => ({
  nombre: f["nombre"],
  apellido: f["apellido"],
  dni: f["dni"],
  fechaNacimiento: f["fecha nacimiento"] || f["fechanacimiento"],
  telefono: f["telefono"],
  email: f["email"],
  direccion: f["direccion"] || f["dirección"] || "",
});

export default function SociosImportacion({ abierto, cerrar, recargar }) {
  const [archivo, setArchivo] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  if (!abierto) return null;

  const alCerrar = () => {
    cerrar();
    setArchivo(null);
    setResultado(null);
    setError("");
  };

  const importar = async () => {
    if (!archivo) {
      setError("Elegí un archivo CSV.");
      return;
    }
    setProcesando(true);
    setError("");
    try {
      const filas = parsearCsv(await archivo.text());
      if (!filas.length) {
        setError("El archivo no contiene filas de datos.");
        return;
      }
      const { datos } = await sociosService.importarSocios(filas.map(aSocio));
      setResultado(datos);
      if (datos?.importados > 0) recargar?.();
    } catch {
      setError("No se pudo leer el archivo.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="payment-modal-backdrop" onClick={alCerrar}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Importar socios</h3>
        <p className="modal-hint">
          Columnas: Nombre, Apellido, DNI, Fecha nacimiento (yyyy-MM-dd),
          Teléfono, Email, Dirección.
        </p>

        <div className="file-input-row">
          <label className="file-input-button">
            Seleccionar archivo CSV
            <input
              type="file"
              accept=".csv"
              className="file-input-hidden"
              onChange={(e) => {
                setArchivo(e.target.files[0]);
                setResultado(null);
                setError("");
              }}
            />
          </label>
          {archivo && (
            <span className="file-input-name">{archivo.name}</span>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {resultado && (
          <p className="success-message">
            {resultado.importados} importados ·{" "}
            {resultado.rechazados} rechazados
          </p>
        )}

        <div className="payment-modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={alCerrar}
          >
            Cerrar
          </button>
          <button
            type="button"
            className="primary-small-button"
            onClick={importar}
            disabled={procesando}
          >
            {procesando ? "Importando..." : "Importar"}
          </button>
        </div>
      </div>
    </div>
  );
}
