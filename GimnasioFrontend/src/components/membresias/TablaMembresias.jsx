// =========================================================
// TABLA DE MEMBRESÍAS — Listado ordenable con acciones
// El vencimiento muestra un chip de urgencia; las acciones
// viven en AccionesMembresia.
// =========================================================

import ThOrdenable from "../common/ThOrdenable";
import AccionesMembresia from "./AccionesMembresia";
import { estadoMembresiaTexto } from "../../utils/membresias";
import { chipVencimiento } from "../../utils/vencimientosMembresia";

const fecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "-";

const claseEstado = (estado) => {
  if (estado === 2) return "status-active";
  if (estado === 1) return "status-warning";
  if (estado === 3) return "status-expired";
  return "status-inactive";
};

function TablaMembresias({
  membresias,
  orden,
  toggleOrden,
  abrirEdicionMembresia,
  prepararRenovacionMembresia,
  suspenderMembresia,
  reactivarMembresia,
  cancelarMembresia,
  eliminarMembresia,
}) {
  const th = (campo, texto) => (
    <ThOrdenable
      campo={campo}
      texto={texto}
      activo={orden.campo === campo}
      asc={orden.asc}
      onOrdenar={toggleOrden}
    />
  );

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {th("socioNombre", "Socio")}
            {th("planNombre", "Plan")}
            {th("precioAplicado", "Precio")}
            {th("fechaInicio", "Fecha inicio")}
            {th("fechaFin", "Vencimiento")}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {membresias.map((membresia) => (
            <tr key={membresia.id}>
              <td>
                {membresia.socioNombre} {membresia.socioApellido}
              </td>

              <td>{membresia.planNombre}</td>

              <td>
                ${Number(membresia.precioAplicado).toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td>{fecha(membresia.fechaInicio)}</td>

              <td>
                {fecha(membresia.fechaFin)}

                <ChipVencimiento membresia={membresia} />
              </td>

              <td>
                <span className={claseEstado(Number(membresia.estado))}>
                  {estadoMembresiaTexto(membresia.estado)}
                </span>
              </td>

              <td>
                <AccionesMembresia
                  membresia={membresia}
                  abrirEdicion={abrirEdicionMembresia}
                  renovar={prepararRenovacionMembresia}
                  suspender={suspenderMembresia}
                  reactivar={reactivarMembresia}
                  cancelar={cancelarMembresia}
                  eliminar={eliminarMembresia}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChipVencimiento({ membresia }) {
  const chip = chipVencimiento(membresia);

  if (!chip) return null;

  return (
    <span className={chip.clase} style={{ marginLeft: "6px" }}>
      {chip.texto}
    </span>
  );
}

export default TablaMembresias;
