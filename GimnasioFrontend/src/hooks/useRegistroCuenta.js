// =========================================================
// HOOK DE REGISTRO DE CUENTA (público)
// Formulario de alta con roles permitidos. Separado de la
// sesión para mantener una responsabilidad por módulo.
// =========================================================

import { useState } from "react";
import { authService } from "../services/authService";
import { mensajeDeError } from "../services/apiClient";

export function useRegistroCuenta() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [registroNombre, setRegistroNombre] = useState("");
  const [registroApellido, setRegistroApellido] = useState("");
  const [registroEmail, setRegistroEmail] = useState("");
  const [registroPassword, setRegistroPassword] = useState("");
  const [registroRolId, setRegistroRolId] = useState("");
  const [rolesRegistro, setRolesRegistro] = useState([]);
  const [cargandoRoles, setCargandoRoles] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [mensajeRegistro, setMensajeRegistro] = useState("");
  const [errorRegistro, setErrorRegistro] = useState("");

  const abrirRegistro = async () => {
    setModoRegistro(true);
    setMensajeRegistro("");
    setErrorRegistro("");

    if (rolesRegistro.length > 0) return;

    setCargandoRoles(true);

    try {
      const { respuesta, datos } =
        await authService.obtenerRolesRegistro();

      if (!respuesta.ok) {
        throw new Error(
          mensajeDeError(datos, `Error HTTP ${respuesta.status}`)
        );
      }

      const rolesPermitidos = Array.isArray(datos)
        ? datos.filter((rol) => rol.activo !== false)
        : [];

      setRolesRegistro(rolesPermitidos);
      setRegistroRolId("");
    } catch (error) {
      console.error("Error al obtener roles:", error);
      setRolesRegistro([]);
      setErrorRegistro("No se pudieron cargar los tipos de cuenta.");
    } finally {
      setCargandoRoles(false);
    }
  };

  const volverAlLogin = () => {
    setModoRegistro(false);
    limpiarCampos();
    setMensajeRegistro("");
    setErrorRegistro("");
  };

  const registrarCuenta = async (event) => {
    event.preventDefault();
    setRegistrando(true);
    setMensajeRegistro("");
    setErrorRegistro("");

    try {
      const { respuesta, datos } = await authService.registrarCuenta({
        nombre: registroNombre,
        apellido: registroApellido,
        email: registroEmail,
        password: registroPassword,
        rolId: Number(registroRolId),
      });

      if (!respuesta.ok) {
        setErrorRegistro(
          mensajeDeError(datos, "No se pudo crear la cuenta.")
        );
        return;
      }

      setMensajeRegistro(
        "Cuenta creada correctamente. Ahora podés iniciar sesión."
      );
      limpiarCampos();

      window.setTimeout(() => {
        volverAlLogin();
      }, 1500);
    } catch (error) {
      console.error("Error al registrar cuenta:", error);
      setErrorRegistro("No se pudo conectar con la API.");
    } finally {
      setRegistrando(false);
    }
  };

  const limpiarCampos = () => {
    setRegistroNombre("");
    setRegistroApellido("");
    setRegistroEmail("");
    setRegistroPassword("");
    setRegistroRolId("");
  };

  /** Reset total (al cerrar sesión). */
  const reiniciarRegistro = () => {
    setModoRegistro(false);
    limpiarCampos();
    setMensajeRegistro("");
    setErrorRegistro("");
  };

  return {
    modoRegistro,
    setModoRegistro,
    registroNombre,
    setRegistroNombre,
    registroApellido,
    setRegistroApellido,
    registroEmail,
    setRegistroEmail,
    registroPassword,
    setRegistroPassword,
    registroRolId,
    setRegistroRolId,
    rolesRegistro,
    cargandoRoles,
    registrando,
    mensajeRegistro,
    errorRegistro,
    abrirRegistro,
    volverAlLogin,
    registrarCuenta,
    reiniciarRegistro,
  };
}
