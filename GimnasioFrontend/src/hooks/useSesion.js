// =========================================================
// HOOK DE SESIÓN
// Login y cierre de sesión. El alta de cuentas vive en
// useRegistroCuenta (compuesto aquí para el mismo contrato).
// La persistencia (recordarme) vive en almacenSesion.
// =========================================================

import { useCallback, useState } from "react";
import { authService } from "../services/authService";
import { mensajeDeError } from "../services/apiClient";
import {
  guardarSesion,
  haySesion,
  limpiarSesion,
  obtenerRol,
} from "../services/almacenSesion";
import { useRegistroCuenta } from "./useRegistroCuenta";

export function useSesion() {
  const [logueado, setLogueado] = useState(haySesion());
  const [rol, setRol] = useState(obtenerRol());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  // UX del formulario
  const [ingresando, setIngresando] = useState(false);
  const [recordar, setRecordar] = useState(true);

  const registro = useRegistroCuenta();

  const cerrarSesion = useCallback(() => {
    limpiarSesion();

    setLogueado(false);
    setRol("");
    setMensaje("");
    setEmail("");
    setPassword("");
    registro.reiniciarRegistro();
  }, [registro]);

  // ---------------------------------------------------------
  // INICIO DE SESIÓN
  // ---------------------------------------------------------

  const iniciarSesion = async (event) => {
    event.preventDefault();
    setMensaje("");

    const validacion = authService.validarCredenciales(
      email,
      password
    );

    if (validacion) {
      setMensaje(validacion);
      return;
    }

    setIngresando(true);

    try {
      const { respuesta, datos } = await authService.iniciarSesion(
        email,
        password
      );

      if (!respuesta.ok) {
        setMensaje(mensajeDeError(
          datos,
          respuesta.status === 401
            ? "Email o contraseña incorrectos."
            : "No se pudo iniciar sesión."
        ));
        return;
      }

      const token = datos?.token;
      const rolNombre = datos?.rolNombre ?? datos?.rol ?? "";
      const usuarioId = datos?.usuarioId ?? "";

      if (!token) {
        setMensaje(
          "La respuesta del servidor no incluye el token de sesión."
        );
        return;
      }

      guardarSesion(
        {
          token,
          rol: rolNombre,
          usuarioId,
          expira: datos.expira,
        },
        recordar
      );

      setRol(rolNombre);
      setLogueado(true);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("No se pudo conectar con la API.");
    } finally {
      setIngresando(false);
    }
  };

  return {
    logueado,
    rol,
    email,
    setEmail,
    password,
    setPassword,
    mensaje,
    setMensaje,
    iniciarSesion,
    cerrarSesion,
    ingresando,
    recordar,
    setRecordar,
    ...registro,
  };
}
