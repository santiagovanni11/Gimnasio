// =========================================================
// HOOK MI CUENTA
// Cambio de la propia contraseña desde la barra superior.
// La validación de reglas vive acá; la llamada, en
// authService.cambiarMiPassword.
// =========================================================

import { useCallback, useState } from "react";
import { authService } from "../services/authService";
import { mensajeDeError } from "../services/apiClient";

const estadoInicialCampos = {
  passwordActual: "",
  passwordNueva: "",
  repetirPassword: "",
};

export function useMiCuenta({ alGuardar } = {}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [campos, setCampos] = useState(estadoInicialCampos);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const abrirModal = useCallback(() => {
    setCampos(estadoInicialCampos);
    setError("");
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

    try {
      const { respuesta, datos } =
        await authService.cambiarMiPassword({
          passwordActual: campos.passwordActual,
          passwordNueva: campos.passwordNueva,
        });

      if (!respuesta.ok) {
        setError(
          mensajeDeError(datos, "No se pudo cambiar la contraseña.")
        );
        return;
      }

      setModalAbierto(false);

      if (alGuardar) alGuardar("Contraseña actualizada correctamente.");
    } catch (errorPeticion) {
      console.error("Error al cambiar contraseña:", errorPeticion);
      setError("No se pudo conectar con la API.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    miCuentaAbierto: modalAbierto,
    camposCuenta: campos,
    cambiandoPassword: guardando,
    errorMiCuenta: error,
    abrirMiCuenta: abrirModal,
    cerrarMiCuenta: cerrarModal,
    cambiarCampoCuenta: cambiarCampo,
    guardarMiPassword: guardar,
  };
}
