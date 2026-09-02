// =========================================================
// LoginHero - Panel de marca del login (presentacional)
// Foto de fondo + propuesta de valor. Sin estado.
// =========================================================

import { Logo, Logotipo } from "../../assets/Marca";

function LoginHero() {
  return (
    <section className="login-hero">
      <img
        className="login-hero-foto"
        src="/Imagenes/Entrenamiento.png"
        alt="Personas entrenando en el gimnasio"
      />
      <div className="login-hero-overlay" />

      <div className="login-hero-contenido">
        <div className="login-marca">
          <Logo size={40} />
          <div className="texto">
            <Logotipo size={20} />
            <small>Gestión de gimnasio</small>
          </div>
        </div>

        <div className="login-hero-pie">
          <h2>Control total de tu gimnasio</h2>
          <p>
            Socios, membresías, pagos, clases y asistencias en un solo
            lugar, pensado para tu día a día.
          </p>
          <ul>
            <li>Seguimiento de socios y cobros en tiempo real</li>
            <li>Reportes de caja y morosos automáticos</li>
            <li>Acceso por roles para todo el equipo</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default LoginHero;