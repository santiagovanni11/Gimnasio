// =========================================================
// MODAL CAMBIAR MI CONTRASEÑA
// Formulario propio del usuario logueado: pide la contraseña
// actual, la nueva y su repetición. Estados desde useMiCuenta.
// =========================================================

function CambiarMiPasswordModal({
  miCuentaAbierto,
  camposCuenta,
  cambiandoPassword,
  errorMiCuenta,
  cerrarMiCuenta,
  cambiarCampoCuenta,
  guardarMiPassword,
}) {
  if (!miCuentaAbierto) return null;

  return (
    <div
      className="payment-modal-backdrop"
      onClick={cerrarMiCuenta}
    >
      <div
        className="payment-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="payment-ticket-header">
          <div>
            <span className="eyebrow">MI CUENTA</span>

            <h3>Cambiar mi contraseña</h3>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={cerrarMiCuenta}
          >
            ×
          </button>
        </div>

        <form onSubmit={guardarMiPassword}>
          <div className="payment-ticket-body">
            <Campo
              etiqueta="Contraseña actual"
              valor={camposCuenta.passwordActual}
              onChange={(valor) =>
                cambiarCampoCuenta("passwordActual", valor)
              }
              autoComplete="current-password"
            />

            <Campo
              etiqueta="Nueva contraseña (mínimo 6)"
              valor={camposCuenta.passwordNueva}
              onChange={(valor) =>
                cambiarCampoCuenta("passwordNueva", valor)
              }
              autoComplete="new-password"
              minimo={6}
            />

            <Campo
              etiqueta="Repetir nueva contraseña"
              valor={camposCuenta.repetirPassword}
              onChange={(valor) =>
                cambiarCampoCuenta("repetirPassword", valor)
              }
              autoComplete="new-password"
              minimo={6}
            />

            {errorMiCuenta && (
              <p className="error-message">{errorMiCuenta}</p>
            )}
          </div>

          <div className="payment-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={cerrarMiCuenta}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={cambiandoPassword}
            >
              {cambiandoPassword ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({
  etiqueta,
  valor,
  onChange,
  autoComplete,
  minimo,
}) {
  return (
    <div className="input-group">
      <label>{etiqueta}</label>

      <input
        type="password"
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        minLength={minimo}
        required
      />
    </div>
  );
}

export default CambiarMiPasswordModal;
