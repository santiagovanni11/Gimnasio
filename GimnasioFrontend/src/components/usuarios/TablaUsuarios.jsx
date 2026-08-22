// =========================================================
// TABLA DE USUARIOS
// Encabezados y filas; el contenido de cada fila vive en
// FilaUsuario. Recibe el listado ya filtrado.
// =========================================================

import FilaUsuario from "./FilaUsuario";

function TablaUsuarios({
  usuarios,
  roles,
  miUsuarioId,
  alternarEstado,
  cambiarRol,
  resetearPassword,
  desbloquear,
  eliminarUsuario,
  verAuditoria,
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Fecha alta</th>
            <th>Último acceso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <FilaUsuario
              key={usuario.id}
              usuario={usuario}
              roles={roles}
              miUsuarioId={miUsuarioId}
              alternarEstado={alternarEstado}
              cambiarRol={cambiarRol}
              resetearPassword={resetearPassword}
              desbloquear={desbloquear}
              eliminarUsuario={eliminarUsuario}
              verAuditoria={verAuditoria}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;
