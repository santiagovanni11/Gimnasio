// =========================================================
// FILA DE USUARIO
// Celdas de datos: nombre/email, rol, fechas, estado (con
// aviso de bloqueo). Las acciones viven en AccionesUsuario.
// =========================================================

import AccionesUsuario from "./AccionesUsuario";
import Avatar from "../common/Avatar";
import { fechaHoraTexto } from "../../utils/fechas";

const formatoFecha = (valor) =>
  valor ? new Date(valor).toLocaleDateString("es-AR") : "-";

const estaBloqueada = (usuario) =>
  Boolean(
    usuario.bloqueadoHasta &&
      new Date(usuario.bloqueadoHasta) > new Date()
  );

function FilaUsuario({
  usuario,
  roles,
  miUsuarioId,
  alternarEstado,
  cambiarRol,
  resetearPassword,
  desbloquear,
  eliminarUsuario,
  verAuditoria,
  editarUsuario,
  asignarClase,
}) {
  const esMiCuenta = Number(usuario.id) === Number(miUsuarioId);
  const bloqueada = estaBloqueada(usuario);

  const nombreCompleto =
    [usuario.nombre, usuario.apellido]
      .filter(Boolean)
      .join(" ") || "-";

  return (
    <tr>
      <td>
        <div className="celda-con-avatar">
          <Avatar
            nombre={usuario.nombre}
            apellido={usuario.apellido}
            email={usuario.email}
          />

          <div>
            <div className="usuario-celda-principal">
              {nombreCompleto}
              {esMiCuenta && (
                <em style={{ marginLeft: "6px", opacity: 0.7 }}>
                  (vos)
                </em>
              )}
            </div>

            <small style={{ color: "#8b929c" }}>{usuario.email}</small>
          </div>
        </div>
      </td>

      <td>
        <select
          className="rol-select"
          value={usuario.rolId}
          onChange={(e) => cambiarRol(usuario, e.target.value)}
          title="Cambiar rol"
        >
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </td>

      <td>{formatoFecha(usuario.fechaCreacion)}</td>

      <td title="Último inicio de sesión exitoso">
        {usuario.ultimoAcceso
          ? fechaHoraTexto(usuario.ultimoAcceso)
          : "Nunca"}
      </td>

      <td>
        <span
          className={
            usuario.activo ? "status-active" : "status-inactive"
          }
        >
          {usuario.activo ? "Activo" : "Inactivo"}
        </span>

        {bloqueada && (
          <span className="status-blocked">Bloqueada</span>
        )}
      </td>

      <td>
        <AccionesUsuario
          usuario={usuario}
          esMiCuenta={esMiCuenta}
          bloqueada={bloqueada}
          alternarEstado={alternarEstado}
          resetearPassword={resetearPassword}
          desbloquear={desbloquear}
          eliminarUsuario={eliminarUsuario}
          verAuditoria={verAuditoria}
          editarUsuario={editarUsuario}
          asignarClase={asignarClase}
        />
      </td>
    </tr>
  );
}

export default FilaUsuario;
