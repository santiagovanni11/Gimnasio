// =========================================================
// ACCIONES DE FILA DE USUARIO
// Sobre la propia cuenta no se ofrecen acciones destructivas
// (clave, desactivar, eliminar): eso se gestiona desde la
// Topbar o desde otra sesión administrativa.
// =========================================================

function AccionesUsuario({
  usuario,
  esMiCuenta,
  bloqueada,
  alternarEstado,
  resetearPassword,
  desbloquear,
  eliminarUsuario,
  verAuditoria,
}) {
  return (
    <div className="table-actions">
      {/* Reset de clave: solo cuentas ajenas; la propia se
          gestiona desde la Topbar. */}
      {!esMiCuenta && (
        <button
          type="button"
          className="edit-button"
          onClick={() => resetearPassword(usuario)}
          title={`Nueva contraseña para ${usuario.email}`}
        >
          Cambiar clave
        </button>
      )}

      {bloqueada && (
        <button
          type="button"
          className="approve-button"
          onClick={() => desbloquear(usuario)}
          title="Quitar el bloqueo por intentos fallidos"
        >
          Desbloquear
        </button>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={() => verAuditoria(usuario)}
        title="Ver historial de cambios"
      >
        Historial
      </button>

      {!esMiCuenta && (
        <button
          type="button"
          className="delete-button"
          onClick={() => eliminarUsuario(usuario)}
          title={`Eliminar definitivamente ${usuario.email}`}
        >
          Eliminar
        </button>
      )}

      {!esMiCuenta && (
        <button
          type="button"
          className={
            usuario.activo ? "delete-button" : "approve-button"
          }
          onClick={() => alternarEstado(usuario)}
          title={
            usuario.activo
              ? "Desactivar la cuenta (baja lógica)"
              : "Reactivar la cuenta"
          }
        >
          {usuario.activo ? "Desactivar" : "Activar"}
        </button>
      )}
    </div>
  );
}

export default AccionesUsuario;
