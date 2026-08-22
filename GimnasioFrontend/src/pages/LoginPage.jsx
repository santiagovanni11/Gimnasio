// =========================================================
// LOGIN — Página de acceso y registro
// El formulario de alta (con invitación) vive en
// FormularioRegistro; acá queda solo el inicio de sesión:
// ver/ocultar clave, recordarme y bloqueo temporal con
// cuenta regresiva.
// =========================================================

import { useEffect, useState } from "react";
import AuthField from "../components/auth/AuthField";
import AuthMessage from "../components/auth/AuthMessage";
import CampoPassword from "../components/auth/CampoPassword";
import FormularioRegistro from "../components/auth/FormularioRegistro";

function LoginPage({ app }) {
  const {
    modoRegistro,
    email,
    password,
    iniciarSesion,
    mensaje,
    abrirRegistro,
    setEmail,
    setPassword,
    ingresando,
    recordar,
    setRecordar,
  } = app;

  // Cuenta regresiva cuando la cuenta está bloqueada.
  const [bloqueadoSegundos, setBloqueadoSegundos] = useState(0);
  const estaBloqueado = bloqueadoSegundos > 0;

  useEffect(() => {
    if (!mensaje) return undefined;

    const coincidencia = mensaje.match(/en (\d+) minuto/);
    if (!coincidencia) return undefined;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- arranca la cuenta regresiva al llegar el aviso
    setBloqueadoSegundos(Number(coincidencia[1]) * 60);
    return undefined;
  }, [mensaje]);

  useEffect(() => {
    if (!estaBloqueado) return undefined;

    const intervalo = setInterval(() => {
      setBloqueadoSegundos((segundos) =>
        segundos > 0 ? segundos - 1 : 0
      );
    }, 1000);

    return () => clearInterval(intervalo);
  }, [estaBloqueado]);

  if (modoRegistro) {
    return (
      <div className="login-page">
        <div className="login-card">
          <Marca />
          <FormularioRegistro app={app} />
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Marca />

        <div className="login-title">
          <h2>Bienvenido</h2>
          <p>Ingresá a tu cuenta para continuar.</p>
        </div>

        <form onSubmit={iniciarSesion}>
          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
            autoFocus
            required
          />

          <CampoPassword
            label="Contraseña"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <label className="login-recordarme">
            <input
              type="checkbox"
              checked={recordar}
              onChange={(event) =>
                setRecordar(event.target.checked)
              }
            />
            Recordarme en este equipo
          </label>

          <button
            className="primary-button"
            type="submit"
            disabled={ingresando || estaBloqueado}
          >
            {ingresando
              ? "Ingresando..."
              : estaBloqueado
                ? `Esperá ${bloqueadoSegundos}s`
                : "Ingresar"}
          </button>
        </form>

        <AuthMessage type="error" message={mensaje} />

        <div className="register-link-container">
          <span>¿No tenés una cuenta?</span>
          <button
            type="button"
            className="register-link"
            onClick={abrirRegistro}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

function Marca() {
  return (
    <div className="brand">
      <div className="brand-icon">GYM</div>
      <div>
        <h1>Gimnasio</h1>
        <span>Panel de gestión</span>
      </div>
    </div>
  );
}

export default LoginPage;
