// =========================================================
// HOOK DE RECUPERACIÓN DE CONTRASEÑA
// Estado y llamadas a la API del flujo "olvidé mi
// contraseña". El renderizado vive en RecuperarPasswordForm.
// =========================================================

import { useState } from "react";
import { authService } from "../services/authService";
import { mensajeDeError } from "../services/apiClient";

export function useRecuperarPassword(onVolver) {
  const [paso, setPaso] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esExito, setEsExito] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const informar = (texto, exito = false) => {
    setMensaje(texto);
    setEsExito(exito);
  };

  const enviarCodigo = async (event) => {
    event.preventDefault();
    setMensaje("");
    setProcesando(true);

    try {
      const { respuesta, datos } =
        await authService.enviarCodigoRecuperacion(email);

      if (!respuesta.ok) {
        informar(mensajeDeError(
          datos,
          "No se pudo enviar el código. Reintentá."
        ));
        return;
      }

      informar(
        datos?.mensaje ?? datos?.Mensaje ?? "Código enviado.",
        true
      );
      setPaso(2);
    } catch {
      informar("No se pudo conectar con la API.");
    } finally {
      setProcesando(false);
    }
  };

  const restablecer = async (event) => {
    event.preventDefault();
    setMensaje("");
    setProcesando(true);

    try {
      const { respuesta, datos } =
        await authService.restablecerPassword({
          email,
          codigo,
          passwordNueva: password,
        });

      if (!respuesta.ok) {
        informar(mensajeDeError(
          datos,
          "No se pudo restablecer la contraseña."
        ));
        return;
      }

      informar(
        "¡Listo! Tu contraseña fue actualizada. " +
          "Ya podés iniciar sesión.",
        true
      );
      setPaso(3);
    } catch {
      informar("No se pudo conectar con la API.");
    } finally {
      setProcesando(false);
    }
  };

  const volverAlLogin = () => {
    setMensaje("");
    setEsExito(false);
    onVolver();
  };

  return {
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
  };
}
