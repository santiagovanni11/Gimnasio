// =========================================================
// PUNTO DE ENTRADA
// useGymApp es el núcleo de la aplicación: decide si se
// muestra el login o el dashboard según la sesión.
// ErrorBoundary evita la pantalla en negro ante un error.
// =========================================================

import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { useGymApp } from "./hooks/useGymApp";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DialogoSistema from "./components/common/DialogoSistema";

function GymApp() {
  const app = useGymApp();

  return (
    <>
      <DialogoSistema />

      {!app.logueado ? (
        <LoginPage app={app} />
      ) : (
        <DashboardPage app={app} />
      )}
    </>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Error en la aplicación:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Ocurrió un error inesperado</h2>

          <pre style={{ whiteSpace: "pre-wrap", color: "#ff8a8f" }}>
            {String(this.state.error?.message ?? this.state.error)}
          </pre>

          <button type="button" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GymApp;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <GymApp />
    </ErrorBoundary>
  </StrictMode>
);
