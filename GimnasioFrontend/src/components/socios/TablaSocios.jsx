// =========================================================
// TABLA DE SOCIOS — Listado con ordenamiento y acciones
// Las acciones de fila viven en AccionesSocio; el indicador
// de datos incompletos usa camposFaltantesDe.
// =========================================================

import ThOrdenable from "../common/ThOrdenable";
import Avatar from "../common/Avatar";
import AccionesSocio from "./AccionesSocio";
import {
  camposFaltantesDe,
  getMembresiaVisual,
} from "../../utils/socios";

const fecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "-";

function TablaSocios({
  socios,
  orden,
  toggleOrden,
  puedeEditarSocios,
  puedeCrearSocios,
  editarSocio,
  alternarEstadoSocio,
  abrirFormularioMembresiaDesdeSocio,
  verFicha,
  inscribirEnClases,
  membresias,
  membresiasRechazadasIds,
  selectedIds = [],
  onToggleSeleccion,
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
            <th style={{ width: "32px" }}>
              <input
                type="checkbox"
                checked={socios.length > 0 && socios.every((socio) => selectedIds.includes(Number(socio.id)))}
                onChange={() => {
                  if (socios.every((socio) => selectedIds.includes(Number(socio.id)))) {
                    socios.forEach((socio) => onToggleSeleccion?.(socio.id));
                    return;
                  }
                  socios.forEach((socio) => {
                    if (!selectedIds.includes(Number(socio.id))) onToggleSeleccion?.(socio.id);
                  });
                }}
              />
            </th>
            {th("nombre", "Nombre")}
            {th("apellido", "Apellido")}
            {th("dni", "DNI")}

            <th>Fecha nacimiento</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Estado socio</th>
            <th>Membresía</th>

            {th("vencimiento", "Vencimiento")}

            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {socios.map((socio) => {
            const visual = getMembresiaVisual(
              socio,
              membresias,
              membresiasRechazadasIds
            );

            const faltantes = camposFaltantesDe(socio);

            return (
              <tr key={socio.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(Number(socio.id))}
                    onChange={() => onToggleSeleccion?.(socio.id)}
                  />
                </td>
                <td>
                  <div className="celda-con-avatar">
                    <Avatar
                      nombre={socio.nombre}
                      apellido={socio.apellido}
                      email={socio.email}
                      fotoUrl={socio.fotoUrl}
                    />

                    <span>
                      {socio.nombre}

                      {faltantes.length > 0 && (
                        <span
                          className="status-warning"
                          style={{ marginLeft: "6px", fontSize: "10px" }}
                          title={`Falta: ${faltantes.join(", ")}`}
                        >
                          datos incompletos
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td>{socio.apellido}</td>
                <td>{socio.dni}</td>

                <td>{fecha(socio.fechaNacimiento)}</td>
                <td>{socio.telefono}</td>
                <td>{socio.email}</td>
                <td>{socio.direccion || "-"}</td>

                <td>
                  <span className={socio.activo ? "status-active" : "status-inactive"}>
                    {socio.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <span className={visual.clase}>{visual.texto}</span>
                  {visual.membresia?.renovacionAutomatica && (
                    <span className="chip-auto">Renov. auto</span>
                  )}
                </td>

                <td>{fecha(visual.fechaFin)}</td>

                <td>
                  <AccionesSocio
                    socio={socio}
                    puedeEditarSocios={puedeEditarSocios}
                    puedeCrearSocios={puedeCrearSocios}
                    editarSocio={editarSocio}
                    alternarEstadoSocio={alternarEstadoSocio}
                    abrirFormularioMembresiaDesdeSocio={
                      abrirFormularioMembresiaDesdeSocio
                    }
                    verFicha={verFicha}
                    inscribirEnClases={inscribirEnClases}
                    membresiasRechazadasIds={membresiasRechazadasIds}
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

export default TablaSocios;
