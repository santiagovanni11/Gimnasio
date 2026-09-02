// =========================================================
// FORMULARIO DE USUARIO — MODAL
// Alta de cuentas y edición de datos (email, nombre,
// apellido, rol). Presentación pura; estado en
// useFormularioUsuario. Los campos viven en
// CamposFormularioUsuario.
// =========================================================

import CamposFormularioUsuario from "./CamposFormularioUsuario";

function FormularioUsuarioModal({
  usuarioModalAbierto,
  usuarioEnEdicion,
  camposUsuario,
  guardandoUsuario,
  errorUsuario,
  roles,
  cerrarModalUsuario,
  cambiarCampoUsuario,
  guardarUsuario,
}) {
  if (!usuarioModalAbierto) return null;

  const enEdicion = Boolean(usuarioEnEdicion);

  return (
    <div className="payment-modal-backdrop" onClick={cerrarModalUsuario}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">USUARIOS</span>
            <h3>{enEdicion ? "Editar usuario" : "Nuevo usuario"}</h3>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={cerrarModalUsuario}
          >
            ×
          </button>
        </div>

        <form onSubmit={guardarUsuario}>
          <CamposFormularioUsuario
            camposUsuario={camposUsuario}
            cambiarCampoUsuario={cambiarCampoUsuario}
            roles={roles}
            enEdicion={enEdicion}
            errorUsuario={errorUsuario}
          />

          <div className="payment-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={cerrarModalUsuario}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-small-button"
              disabled={guardandoUsuario}
            >
              {guardandoUsuario
                ? "Guardando..."
                : enEdicion
                  ? "Guardar cambios"
                  : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioUsuarioModal;
