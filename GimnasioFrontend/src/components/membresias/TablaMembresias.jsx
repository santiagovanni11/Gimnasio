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
  verDetalle,
  seleccionadas = [],
  onToggleSeleccion,
  pagos = [],
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
            <th style={{ width: "30px" }}>
              <input
                type="checkbox"
                title="Seleccionar para renovar"
                aria-label="Seleccionar para renovar"
                checked={membresias.length > 0 && membresias.every((m) => seleccionadas.includes(Number(m.id)))}
                onChange={() => {
                  const ids = membresias.map((m) => Number(m.id));
                  if (ids.every((id) => seleccionadas.includes(id))) {
                    ids.forEach((id) => onToggleSeleccion?.(id));
                    return;
                  }
                  ids.forEach((id) => {
                    if (!seleccionadas.includes(id)) onToggleSeleccion?.(id);
                  });
                }}
              />
            </th>
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
          {membresias.map((membresia) => {
            const deuda = Number(membresia.precioAplicado || 0) - pagos
              .filter((pago) => Number(pago.membresiaId) === Number(membresia.id) && Number(pago.estado) === 2)
              .reduce((sum, pago) => sum + Number(pago.monto || 0), 0);

            return (
            <tr key={membresia.id}>
              <td>
                <input
                  type="checkbox"
                  title="Seleccionar para renovar"
                  aria-label={`Seleccionar ${membresia.socioNombre} ${membresia.socioApellido} para renovar`}
                  checked={seleccionadas.includes(Number(membresia.id))}
                  onChange={() => onToggleSeleccion?.(membresia.id)}
                />
              </td>
              <td>
                {membresia.socioNombre} {membresia.socioApellido}
              </td>

              <td>
                {membresia.planNombre}
                {membresia.renovacionAutomatica && (
                  <span className="chip-auto">Renov. auto</span>
                )}
              </td>

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
                {deuda > 0 && <span className="status-warning" style={{ marginLeft: "6px" }}>Deuda</span>}
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
                  verDetalle={verDetalle}
                />
              </td>
            </tr>
            );
          })}
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
