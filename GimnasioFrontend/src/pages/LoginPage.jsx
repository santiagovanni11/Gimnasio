// LOGIN — Pantalla de acceso (tarjeta profesional DiseñoLogin)

import { useEffect, useState } from "react";
import AuthField from "../components/auth/AuthField";
import AuthMessage from "../components/auth/AuthMessage";
import CampoPassword from "../components/auth/CampoPassword";
import FormularioRegistro from "../components/auth/FormularioRegistro";
import LoginHero from "../components/auth/LoginHero";
import { Logo, Logotipo } from "../assets/Marca";

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

  const [bloqueadoSegundos, setBloqueadoSegundos] = useState(0);
  const estaBloqueado = bloqueadoSegundos > 0;

  useEffect(() => {
    if (!mensaje) return undefined;
    const match = mensaje.match(/en (\d+) minuto/);
    if (!match) return undefined;
    setBloqueadoSegundos(Number(match[1]) * 60);
    return undefined;
  }, [mensaje]);

  useEffect(() => {
    if (!estaBloqueado) return undefined;
    const id = setInterval(
      () => setBloqueadoSegundos((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, [estaBloqueado]);

  // Renderiza el formulario de login o registro como rama única
  const formRender = () => {
    if (modoRegistro) {
      return <FormularioRegistro app={app} />;
    }

    return (
      <>

        <form onSubmit={iniciarSesion}>
          <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setRecordar(e.target.checked)}
            />
            Recordarme en este equipo
          </label>

          <button
            className="login-button"
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
      </>
    );
  };

  return (
    <div className="login-page">
      <LoginHero />

      <section className="login-container">
        <div className="login-card">
          <header className="login-header">
            <div className="login-brand">
              <Logo size={36} />
              <Logotipo size={18} />
            </div>
            <h1 className="login-titulo">
              {modoRegistro ? "Creá tu cuenta" : "Bienvenido"}
            </h1>
            <p className="login-subtitulo">
              {modoRegistro
                ? "Comenzá a gestionar tu gimnasio"
                : "Iniciá sesión para continuar"}
            </p>
          </header>

          <div className="login-form">{formRender()}</div>

          <footer className="login-footer">
            <div className="login-links">
              <span>¿No tenés una cuenta?</span>
              <button type="button" className="login-registrarse" onClick={abrirRegistro}>
                Crear cuenta
              </button>
            </div>
            <p className="login-copyright">© FORZA · Software para gimnasios</p>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;