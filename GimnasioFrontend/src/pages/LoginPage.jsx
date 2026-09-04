// LOGIN — Pantalla de acceso (tarjeta profesional DiseñoLogin)

import { useState } from "react";
import AuthField from "../components/auth/AuthField";
import AuthMessage from "../components/auth/AuthMessage";
import CampoPassword from "../components/auth/CampoPassword";
import FormularioRegistro from "../components/auth/FormularioRegistro";
import LoginHero from "../components/auth/LoginHero";
import RecuperarPasswordForm from "../components/auth/RecuperarPasswordForm";
import { Logo, Logotipo } from "../assets/Marca";
import { useBloqueoLogin } from "../hooks/useBloqueoLogin";

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

  const [modoRecuperar, setModoRecuperar] = useState(false);
  const { bloqueadoSegundos, estaBloqueado } =
    useBloqueoLogin(mensaje);

  // Renderiza el formulario de login o registro como rama única
  const formRender = () => {
    if (modoRecuperar) {
      return (
        <RecuperarPasswordForm
          onVolver={() => {
            setModoRecuperar(false);
          }}
        />
      );
    }

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
            type="button"
            className="login-olvidaste"
            onClick={() => setModoRecuperar(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>

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