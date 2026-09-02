// =========================================================
// HOOK MI CUENTA
// Cambio de la propia contraseña desde la barra superior.
// La validación de reglas vive acá; la llamada, en
// authService.cambiarMiPassword. Usa el ejecutor uniforme
// (apiEjecutor) para distinguir sesión expirada, permisos,
// errores de la API y errores de red.
// =========================================================

import { useCallback, useState } from "react";
import { authService } from "../services/authService";
import { crearEjecutorApi } from "../services/apiEjecutor";

const estadoInicialCampos = {
  passwordActual: "",
  passwordNueva: "",
  repetirPassword: "",
};

export function useMiCuenta({ alGuardar, onSesionExpirada } = {}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [campos, setCampos] = useState(estadoInicialCampos);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [ejecutar] = useState(() =>
    crearEjecutorApi({ onSesionExpirada })
  );

  const abrirModal = useCallback(() => {
    setCampos(estadoInicialCampos);
    setError("");
    setExito("");
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
  }, []);

  const cambiarCampo = (nombre, valor) => {
    setCampos((previo) => ({ ...previo, [nombre]: valor }));
  };

  /** Validaciones locales previas a la llamada. */
  const validar = () => {
    if (!campos.passwordActual) {
      return "Ingresá tu contraseña actual.";
    }

    if (campos.passwordNueva.length < 6) {
      return "La nueva contraseña debe tener al menos 6 caracteres.";
    }

    if (campos.passwordNueva !== campos.repetirPassword) {
      return "Las contraseñas nuevas no coinciden.";
    }

    if (campos.passwordNueva === campos.passwordActual) {
      return "La nueva contraseña debe ser distinta de la actual.";
    }

    return "";
  };

  const guardar = async (event) => {
    event.preventDefault();

    const validacion = validar();
    if (validacion) {
      setError(validacion);
      return;
    }

    setGuardando(true);
    setError("");
    setExito("");

    const resultado = await ejecutar({
      peticion: () =>
        authService.cambiarMiPassword({
          passwordActual: campos.passwordActual,
          passwordNueva: campos.passwordNueva,
        }),
      onError: setError,
      mensajeError: "No se pudo cambiar la contraseña.",
      mensajeRed: "No se pudo conectar con la API.",
      etiquetaLog: "Error al cambiar contraseña:",
    });

    setGuardando(false);

    if (!resultado) return;

    setExito("Contraseña cambiada con éxito.");

    if (alGuardar) alGuardar("Contraseña cambiada con éxito.");
  };

  return {
    miCuentaAbierto: modalAbierto,
    camposCuenta: campos,
    cambiandoPassword: guardando,
    errorMiCuenta: error,
    exitoMiCuenta: exito,
    abrirMiCuenta: abrirModal,
    cerrarMiCuenta: cerrarModal,
    cambiarCampoCuenta: cambiarCampo,
    guardarMiPassword: guardar,
  };
}
