// =========================================================
// TABLA DE SOCIOS — Listado con ordenamiento y acciones
// =========================================================

import ThOrdenable from "../common/ThOrdenable";
import { getMembresiaVisual } from "../../utils/socios";

const fecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "-";

/** Merece renovación: sin membresía, vencida o rechazada. */
const necesitaRenovacion = (socio, rechazadasIds) =>
  !socio.membresia ||
  socio.membresia.estado !== "Vigente" ||
  rechazadasIds?.has(Number(socio.membresia.id));

function TablaSocios({
  socios,
  orden,
  toggleOrden,
  puedeEditarSocios,
  puedeCrearSocios,
  puedeEliminarSocios,
  editarSocio,
  alternarEstadoSocio,
  abrirFormularioMembresiaDesdeSocio,
  verFicha,
  membresias,
  membresiasRechazadasIds,
}) {
  const conAcciones = puedeEditarSocios || puedeEliminarSocios;

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

            {conAcciones && <th>Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {socios.map((socio) => {
            const visual = getMembresiaVisual(
              socio,
              membresias,
              membresiasRechazadasIds
            );

            return (
              <tr key={socio.id}>
                <td>{socio.nombre}</td>
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
                </td>

                <td>{fecha(visual.fechaFin)}</td>

                {conAcciones && (
                  <td>
                    {puedeEditarSocios && (
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => editarSocio(socio)}
                      >
                        Editar
                      </button>
                    )}

                    {puedeCrearSocios && necesitaRenovacion(socio, membresiasRechazadasIds) && (
                      <button
                        type="button"
                        className="approve-button"
                        onClick={() => abrirFormularioMembresiaDesdeSocio(socio.id)}
                        title="Asignar nueva membresía"
                      >
                        Renovar
                      </button>
                    )}

                    <button
                      type="button"
                      className="view-button"
                      onClick={() => verFicha(socio)}
                      title="Ver ficha completa"
                    >
                      Ficha
                    </button>

                    {puedeEditarSocios && (
                      <button
                        type="button"
                        className={socio.activo === false ? "approve-button" : "cancel-button"}
                        onClick={() => alternarEstadoSocio(socio)}
                        title={
                          socio.activo === false
                            ? "Reactivar socio"
                            : "Desactivar socio"
                        }
                      >
                        {socio.activo === false ? "Activar" : "Desactivar"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaSocios;
