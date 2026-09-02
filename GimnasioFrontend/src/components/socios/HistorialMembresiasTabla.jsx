// =========================================================
// HISTORIAL DE MEMBRESÍAS DEL SOCIO
// Todas las membresías del socio, de la más reciente a la
// más antigua, con su estado (incluye rechazadas).
// =========================================================

import { formatoMoneda } from "../../utils/pagos";
import { estadoMembresiaTexto } from "../../utils/membresias";

const fecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "-";

const claseEstado = (texto) => {
  if (texto === "Activa") return "status-active";
  if (texto === "Pendiente") return "status-warning";
  if (texto === "Vencida") return "status-expired";
  if (texto === "Rechazada") return "status-rejected";
  return "status-inactive";
};

/** Orden por vigencia: fecha inicio más reciente y luego Id mayor. */
const masRecientePrimero = (a, b) =>
  new Date(b.fechaInicio) - new Date(a.fechaInicio) ||
  Number(b.id) - Number(a.id);

function HistorialMembresiasTabla({ membresias = [] }) {
  if (!membresias.length) return null;

  const ordenadas = [...membresias].sort(masRecientePrimero);

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Estado</th>
            <th>Inicio</th>
            <th>Vencimiento</th>
            <th>Precio</th>
          </tr>
        </thead>

        <tbody>
          {ordenadas.map((membresia) => {
            const texto =
              membresia.estadoTexto ||
              estadoMembresiaTexto(membresia.estado);

            return (
              <tr key={membresia.id}>
                <td>
                  {membresia.planNombre || `Plan #${membresia.planId}`}
                  {membresia.renovacionAutomatica && (
                    <span className="chip-auto">Renov. auto</span>
                  )}
                </td>

                <td>
                  <span className={claseEstado(texto)}>{texto}</span>
                </td>

                <td>{fecha(membresia.fechaInicio)}</td>
                <td>{fecha(membresia.fechaFin)}</td>

                <td>{formatoMoneda(membresia.precioAplicado)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialMembresiasTabla;
