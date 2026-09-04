// RECUPERAR CONTRASEÑA — Render de los dos pasos del flujo
// "olvidé mi contraseña". La lógica vive en
// useRecuperarPassword; volver muestra de nuevo el login.

import AuthField from "./AuthField";
import AuthMessage from "./AuthMessage";
import CampoPassword from "./CampoPassword";
import { useRecuperarPassword } from "../../hooks/useRecuperarPassword";

function RecuperarPasswordForm({ onVolver }) {
  const {
    paso,
    email,
    setEmail,
    codigo,
    setCodigo,
    password,
    setPassword,
    mensaje,
    esExito,
    procesando,
    enviarCodigo,
    restablecer,
    volverAlLogin,
  } = useRecuperarPassword(onVolver);

  return (
    <>
      {paso === 1 && (
        <form onSubmit={enviarCodigo}>
          <p className="recuperar-intro">
            Ingresá tu email y te enviamos un código para
            restablecer la contraseña.
          </p>
          <AuthField
            label="Email de tu cuenta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            autoFocus
            required
          />
          <button className="login-button" type="submit" disabled={procesando}>
            {procesando ? "Enviando..." : "Enviar código"}
          </button>
        </form>
      )}

      {paso === 2 && (
        <form onSubmit={restablecer}>
          <AuthField
            label="Código de 6 dígitos"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="000000"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            title="El código tiene 6 dígitos"
            autoFocus
            required
          />
          <CampoPassword
            label="Nueva contraseña"
            value={password}
            onChange={setPassword}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            minLength={6}
            required
          />
          <button className="login-button" type="submit" disabled={procesando}>
            {procesando ? "Guardando..." : "Restablecer contraseña"}
          </button>
        </form>
      )}

      {paso === 3 && (
        <button className="login-button" type="button" onClick={volverAlLogin}>
          Ir al login
        </button>
      )}

      <AuthMessage
        type={esExito ? "success" : "error"}
        message={mensaje}
      />

      {paso !== 3 && (
        <div className="login-links">
          <button
            type="button"
            className="login-registrarse"
            onClick={volverAlLogin}
          >
            ← Volver al login
          </button>
        </div>
      )}
    </>
  );
}

export default RecuperarPasswordForm;
